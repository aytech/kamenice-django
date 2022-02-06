class FormHelper:
    @staticmethod
    def get_value(value, default=None):
        return value if value is not None and value.strip() != '' else default

    @staticmethod
    def get_attribute_value(obj=None, attr=None):
        if hasattr(obj, attr):
            return FormHelper.get_value(obj[attr])
        return None

    @staticmethod
    def get_numeric(value, default=None):
        if FormHelper.get_value(value) is None:
            return default
        try:
            return value if int(value) > 0 else default
        except ValueError:
            try:
                return value if float(value) > 0 else default
            except ValueError:
                pass
        return default
