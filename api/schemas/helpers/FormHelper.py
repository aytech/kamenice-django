class FormHelper:
    @staticmethod
    def get_value(value, default=None):
        return value if value is not None and value.strip() != '' else default
