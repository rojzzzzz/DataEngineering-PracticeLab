from src.progression import unlock_next

def test_hint_progression_unlocks_only_one_level():
    hints=["hint one","hint two","hint three"]
    first,opened=unlock_next(hints,[])
    assert first=="hint one" and opened==[1]
    second,opened=unlock_next(hints,opened)
    assert second=="hint two" and opened==[1,2]
    third,opened=unlock_next(hints,opened)
    assert third=="hint three" and opened==[1,2,3]
    assert unlock_next(hints,opened)==(None,[1,2,3])

def test_complication_progression_is_sequential():
    complications=["one","two"]
    assert unlock_next(complications,[])[0]=="one"
    assert unlock_next(complications,[1])[0]=="two"
