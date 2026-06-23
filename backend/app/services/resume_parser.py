import fitz


def extract_resume_text(
    pdf_path: str
):

    document = fitz.open(
        pdf_path
    )

    text = ""

    for page in document:
        text += (
            page.get_text()
            + "\n"
        )

    document.close()

    return text