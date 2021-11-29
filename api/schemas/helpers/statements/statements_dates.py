def get_report_dates_requests(from_date, to_date):
    return [
        {
            'replaceAllText': {
                'containsText': {
                    'text': '{{date_from}}',
                    'matchCase': 'true'
                },
                'replaceText': '{}.{}.{}'.format(from_date.day, from_date.month, from_date.year),
            }
        },
        {
            'replaceAllText': {
                'containsText': {
                    'text': '{{date_to}}',
                    'matchCase': 'true'
                },
                'replaceText': '{}.{}.{}'.format(to_date.day, to_date.month, to_date.year),
            }
        }
    ]
