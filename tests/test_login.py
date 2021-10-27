import pytest
from selenium.webdriver import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait

from tests.test_main import APP_URL, USERNAME, PASSWORD, login
from tests.test_main import driver_init


@pytest.mark.usefixtures('driver_init')
class TestLogin:
    def test_login(self):
        self.driver.get(APP_URL)
        login(self.driver)
        assert len(self.driver.find_elements_by_css_selector('li.ant-menu-item')) == 3
