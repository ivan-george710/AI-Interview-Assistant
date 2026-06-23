from jobspy import scrape_jobs


def search_real_jobs(
    keyword: str,
    location: str = "India"
):

    jobs = scrape_jobs(
        site_name=[
            "linkedin",
            "indeed"
        ],

        search_term=keyword,

        location=location,

        results_wanted=20,

        hours_old=72,

        country_indeed="India"
    )

    return jobs.to_dict(
        orient="records"
    )