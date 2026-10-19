"""Width-aware SQL/Jinja formatting; never renders templates or executes SQL."""
import re
from uuid import uuid4

from sqlfmt.api import format_string
from sqlfmt.mode import Mode
from sqlfmt.tokens import TokenType


def format_sql(source, keyword_case="upper", tab_width=2, line_length=88):
    if not isinstance(source, str) or not source.strip() or len(source) > 200_000:
        raise ValueError("Enter SQL, up to 200,000 characters.")
    if keyword_case not in ("upper", "lower", "preserve"):
        raise ValueError("Choose a supported keyword case.")
    if type(tab_width) is not int or tab_width not in (2, 4):
        raise ValueError("Choose 2 or 4 spaces for indentation.")
    if type(line_length) is not int or line_length not in (80, 88, 100, 120):
        raise ValueError("Choose a line width of 80, 88, 100, or 120.")

    # No optional Python/Jinja code formatter: keep tag contents untouched.
    # The engine performs its token-equivalence safety check (fast=False).
    # Raw sections can contain deliberately invalid template/SQL syntax.
    # Protect them as opaque Jinja expressions, then restore every byte.
    raw_sections = {}
    marker = "sqlfmt_raw_" + uuid4().hex

    def protect_raw(match):
        key = "{{ " + marker + str(len(raw_sections)) + " }}"
        raw_sections[key] = match.group()
        return key

    source = re.sub(r"\{%[-+]?\s*raw\s*[-+]?%\}.*?\{%[-+]?\s*endraw\s*[-+]?%\}",
                    protect_raw, source, flags=re.DOTALL)
    mode = Mode(line_length=line_length, no_jinjafmt=True)
    mode.dialect.case_sensitive_names = True
    formatted = format_string(source, mode)
    analyzer = mode.dialect.initialize_analyzer(line_length=line_length)
    original = analyzer.parse_query(source_string=source)
    output = analyzer.parse_query(source_string=formatted)
    raw_tokens = [t for t in original.tokens if t.type.is_equivalent_in_output]
    out_tokens = [t for t in output.tokens if t.type.is_equivalent_in_output]
    stack = []
    for token in raw_tokens:
        if token.type == TokenType.JINJA_BLOCK_START:
            stack.append(token)
        elif token.type == TokenType.JINJA_BLOCK_END:
            if not stack:
                raise ValueError("Jinja has an unexpected closing block.")
            stack.pop()
    if stack:
        raise ValueError("Jinja has an unclosed block: " + stack[-1].token)
    if [t.type for t in raw_tokens] != [t.type for t in out_tokens]:
        raise ValueError("Formatting changed SQL tokens. The input was left untouched.")

    depths = {node.token.spos: node.depth for line in output.lines for node in line.nodes}

    def standalone(token):
        if token.type not in (TokenType.JINJA_BLOCK_START, TokenType.JINJA_BLOCK_END, TokenType.JINJA_BLOCK_KEYWORD):
            return False
        before = source[source.rfind("\n", 0, token.spos) + 1:token.spos]
        end = source.find("\n", token.epos)
        after = source[token.epos:end if end != -1 else len(source)]
        return not (before + token.prefix + after).strip()

    edits = []
    for index, (raw, token) in enumerate(zip(raw_tokens, out_tokens)):
        value = token.token
        if token.type == TokenType.NAME:
            # sqlfmt normally lowercases unquoted names. Case-sensitive names,
            # function names and parameters must retain their original spelling.
            value = raw.token
            if value.lower() in ("asc", "desc", "null", "true", "false", "current_date", "current_timestamp") and keyword_case != "preserve":
                value = getattr(value, keyword_case)()
        elif token.type.is_always_lowercased and token.type != TokenType.NUMBER:
            value = raw.token if keyword_case == "preserve" else getattr(value, keyword_case)()
        elif token.type.is_jinja or token.type in (TokenType.DATA, TokenType.QUOTED_NAME):
            value = raw.token
        prefix = token.prefix
        if tab_width == 2 and prefix and not prefix.strip():
            # Only lexer whitespace is changed; multiline strings, raw blocks,
            # Jinja expressions and comments never pass through a line regex.
            before, separator, indent = prefix.rpartition("\n")
            if separator or token.spos == 0 or formatted[token.spos - 1:token.spos] == "\n":
                prefix = before + separator + " " * (len(indent) // 2)
        start = token.spos
        if index:
            previous = out_tokens[index - 1]
            gap = formatted[previous.epos:token.spos]
            raw_gap = source[raw_tokens[index - 1].epos:raw.spos] + raw.prefix
            adjacent_jinja = not raw_gap and (raw.type.is_jinja or raw_tokens[index - 1].type.is_jinja)
            if (adjacent_jinja or token.type == TokenType.SEMICOLON) and not gap.strip():
                start = previous.epos
                prefix = ""
            if (standalone(raw) or standalone(raw_tokens[index - 1])) and not gap.strip():
                start = previous.epos
                sql_depth, jinja_depth = depths.get(token.spos, (0, 0))
                # A block before WHERE/GROUP BY belongs with that clause, not
                # with the preceding FROM table or WHERE expression.
                if standalone(raw) and index + 1 < len(out_tokens):
                    following = out_tokens[index + 1]
                    if following.type in (TokenType.UNTERM_KEYWORD, TokenType.STATEMENT_END):
                        sql_depth = min(sql_depth, depths.get(following.spos, (0, 0))[0])
                prefix = "\n" + " " * (tab_width * (sql_depth + jinja_depth))
        edits.append((start, token.epos, prefix + value))
    pieces, cursor = [], 0
    for start, end, value in edits:
        pieces.extend((formatted[cursor:start], value))
        cursor = end
    pieces.append(formatted[cursor:])
    formatted = "".join(pieces)
    for key, raw in raw_sections.items():
        formatted = formatted.replace(key, raw)
    return {"sql": formatted.rstrip() + "\n", "diagnostics": [
        "SQL and Jinja formatted; templates are not rendered and SQL is not executed."
    ]}
