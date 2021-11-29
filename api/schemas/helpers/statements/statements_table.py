def get_table_requests(document_content, columns_count, data_length):
    requests = []
    for section in document_content:
        paragraph = section.get('paragraph')
        if paragraph is not None:
            for element in paragraph.get('elements'):
                if '{{list_table}}' in element.get('textRun').get('content'):
                    requests.append({
                        'insertTable': {
                            'rows': data_length,
                            'columns': columns_count,
                            'location': {
                                'segmentId': '',
                                'index': element.get('startIndex')
                            }
                        },
                    })
                    requests.append({
                        'replaceAllText': {
                            'containsText': {
                                'text': '{{list_table}}',
                                'matchCase': 'true'
                            },
                            'replaceText': '',
                        }
                    })
    return requests
