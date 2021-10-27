import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait

from tests.test_main import APP_URL, login
from tests.test_main import driver_init


@pytest.mark.usefixtures('driver_init')
class TestSuites:
    def test_navigate(self):
        self.driver.get(APP_URL)
        login(self.driver)
        self.driver.find_element_by_xpath('//a[@href="/apartma"]').click()
        WebDriverWait(self.driver, 10).until(
            expected_conditions.presence_of_element_located((By.CLASS_NAME, 'add-suite'))
        )
        self.driver.find_element_by_class_name('add-suite').click()
        WebDriverWait(self.driver, 10).until(
            expected_conditions.presence_of_element_located((By.CLASS_NAME, 'ant-drawer'))
        )
