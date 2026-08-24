from pathlib import Path

from PIL import Image


ROOT = Path(r"C:\Users\kgh\Documents\Codex\2026-08-22\new-chat\SchoolPrison-PV")
WEBTOON = Path(r"F:\NAI저장소\2026-08\학폭물\웹툰")
OUTPUTS = Path(r"C:\Users\kgh\Documents\Codex\2026-08-24\s\outputs")
TITLE = Path(r"C:\Users\kgh\Documents\학교라는이름의 감옥.png")
DESTINATION = ROOT / "public" / "pv"

ASSETS = {
    "01-sohyeon-greeting.webp": WEBTOON / "1.이소현이친구와인사하는이미지.png",
    "02-heeju-mock.webp": WEBTOON / "2.저년또내숭부리네.png",
    "03-sohyeon-unbothered.webp": WEBTOON / "3.소현이아무렇지않게가는이미지.png",
    "04-heeju-scheming.webp": WEBTOON / "4.저년어떻게하는방법.png",
    "05-sohyeon-brilliant.webp": WEBTOON / "5.엄친딸이미지완전그게나의이미지다.png",
    "06-funeral.webp": WEBTOON / "6.장례식장의이소현.png",
    "07-breakdown.webp": WEBTOON / "7.소현이멘붕사진.png",
    "08-doyoon-rejected.webp": WEBTOON / "8. 김도훈 반려장면.png",
    "09-heeju-retaliation.webp": WEBTOON / "8-1진희주가김도윤반려장면비꼬는것.png",
    "10-seonghoon-anger.webp": WEBTOON / "9.박성훈이 소리치는 것.png",
    "11-principal-confrontation.webp": WEBTOON / "10.교장멱살잡는장면.png",
    "12-seonghoon-documents.webp": WEBTOON / "11.학폭위서류작성하는박성훈.png",
    "13-this-time.webp": WEBTOON / "12.소현아 이번엔 진짜로 돼.png",
    "14-stop-teacher.webp": WEBTOON / "13.그게 무슨말이야 진짜로 된다고.png",
    "15-crying-smile.webp": WEBTOON / "14.울면서웃는소현이.png",
    "16-seonghoon-collapse.webp": WEBTOON / "15.박성훈이소현을보고자존감이무너지는장면.png",
    "17-transfer-student.webp": WEBTOON / "16.전학생이 오는 사진.png",
    "18-desk-graffiti.webp": OUTPUTS / "15-1.책상욕설낙서장면_사물확대_원본.png",
    "19-lunch-tray.webp": OUTPUTS / "15-2.급식판엎어진장면_사물확대.png",
    "title.webp": TITLE,
}


def convert(source: Path, destination: Path) -> None:
    if not source.exists():
        raise FileNotFoundError(source)

    with Image.open(source) as image:
        image.load()
        longest = max(image.size)
        if longest > 1600:
            scale = 1600 / longest
            image = image.resize(
                (round(image.width * scale), round(image.height * scale)),
                Image.Resampling.LANCZOS,
            )

        if image.mode not in {"RGB", "RGBA"}:
            image = image.convert("RGBA" if "transparency" in image.info else "RGB")

        image.save(destination, "WEBP", quality=84, method=6, exact=True)


DESTINATION.mkdir(parents=True, exist_ok=True)
for output_name, source_path in ASSETS.items():
    convert(source_path, DESTINATION / output_name)
    print(f"{output_name}: {(DESTINATION / output_name).stat().st_size / 1024:.1f} KiB")
