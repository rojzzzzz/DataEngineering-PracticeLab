"""Compile a bounded, constructive subset of Python regex into generation rules.

No regex matching or rejection sampling runs on generated values. Unsupported
assertions, backreferences and flags are rejected before any job is started.
"""
from functools import lru_cache
import re
from re import _parser as parser, _constants as c
import string

ALPHABET = string.ascii_letters + string.digits + string.punctuation + " "
CATEGORIES = {
    c.CATEGORY_DIGIT: string.digits,
    c.CATEGORY_WORD: string.ascii_letters + string.digits + "_",
    c.CATEGORY_SPACE: " \t\n\r\f\v",
}


def _category(category):
    if category in CATEGORIES:
        return CATEGORIES[category]
    inverse = {c.CATEGORY_NOT_DIGIT: c.CATEGORY_DIGIT,
               c.CATEGORY_NOT_WORD: c.CATEGORY_WORD, c.CATEGORY_NOT_SPACE: c.CATEGORY_SPACE}
    if category in inverse:
        return "".join(ch for ch in ALPHABET if ch not in CATEGORIES[inverse[category]])
    raise ValueError("Unsupported RegEx character category.")


@lru_cache(maxsize=128)
def compile_pattern(pattern, max_length):
    if not isinstance(pattern, str) or not pattern or len(pattern) > 500:
        raise ValueError("Enter a RegEx pattern of 1–500 characters, without / delimiters.")
    try:
        tree = parser.parse(pattern, 0)
    except (re.error, RecursionError, OverflowError, ValueError) as exc:
        raise ValueError(f"Invalid RegEx: {exc}") from None
    if tree.state.flags != re.UNICODE:
        raise ValueError("RegEx flags are unsupported. Use explicit character classes instead.")

    def build(nodes, depth=0):
        if depth > 30:
            raise ValueError("RegEx groups are nested too deeply; simplify the pattern.")
        rules, width = [], 0
        for op, arg in nodes:
            if op == c.LITERAL:
                rule, size = ("text", chr(arg)), 1
            elif op in (c.IN, c.CATEGORY, c.NOT_LITERAL, c.ANY):
                if op == c.CATEGORY:
                    chars = _category(arg)
                elif op == c.NOT_LITERAL:
                    chars = "".join(ch for ch in ALPHABET if ord(ch) != arg)
                elif op == c.ANY:
                    chars = ALPHABET
                else:
                    negate = bool(arg and arg[0][0] == c.NEGATE)
                    chars = ""
                    for item, value in arg[1:] if negate else arg:
                        if item == c.LITERAL:
                            chars += chr(value)
                        elif item == c.RANGE:
                            if value[1] - value[0] > 4000:
                                raise ValueError("RegEx character ranges may span at most 4,001 characters.")
                            chars += "".join(map(chr, range(value[0], value[1] + 1)))
                        elif item == c.CATEGORY:
                            chars += _category(value)
                        else:
                            raise ValueError("Unsupported RegEx character class.")
                    chars = "".join(ch for ch in ALPHABET if ch not in chars) if negate else "".join(dict.fromkeys(chars))
                if not chars:
                    raise ValueError("RegEx character class has no supported characters.")
                rule, size = ("chars", chars), 1
            elif op == c.SUBPATTERN:
                _, add_flags, del_flags, child = arg
                if add_flags or del_flags:
                    raise ValueError("RegEx group flags are unsupported.")
                rule, size = build(child, depth + 1)
            elif op == c.BRANCH:
                branches = [build(child, depth + 1) for child in arg[1]]
                rule, size = ("branch", tuple(r for r, _ in branches)), max(w for _, w in branches)
            elif op in (c.MAX_REPEAT, c.MIN_REPEAT):
                low, high, child = arg
                child_rule, child_width = build(child, depth + 1)
                if child_width == 0:
                    raise ValueError("RegEx cannot repeat an empty group; remove that quantifier.")
                high = min(low + 10, max_length) if high == c.MAXREPEAT else high
                if low > high or high > 4000:
                    raise ValueError("RegEx repeats exceed the text length limit; reduce the quantifier.")
                rule, size = ("repeat", low, high, child_rule), high * child_width
            elif op == c.AT:
                # Anchors are accepted only at the outer boundaries below.
                raise ValueError("Place ^ and $ only at the start and end of the pattern.")
            else:
                raise ValueError("RegEx lookarounds, backreferences and conditional expressions are unsupported.")
            width += size
            if width > max_length:
                raise ValueError("RegEx can exceed Maximum text length. Increase that limit or reduce the quantifiers.")
            rules.append(rule)
        return ("sequence", tuple(rules)), width

    nodes = list(tree)
    if nodes and nodes[0][0] == c.AT and nodes[0][1] in (c.AT_BEGINNING, c.AT_BEGINNING_STRING):
        nodes.pop(0)
    if nodes and nodes[-1][0] == c.AT and nodes[-1][1] in (c.AT_END, c.AT_END_STRING):
        nodes.pop()
    return build(nodes)[0]


def generate_pattern(rule, rng):
    kind, *args = rule
    if kind == "text":
        return args[0]
    if kind == "chars":
        return rng.choice(args[0])
    if kind == "branch":
        return generate_pattern(rng.choice(args[0]), rng)
    if kind == "repeat":
        low, high, child = args
        return "".join(generate_pattern(child, rng) for _ in range(rng.randint(low, high)))
    return "".join(generate_pattern(child, rng) for child in args[0])
