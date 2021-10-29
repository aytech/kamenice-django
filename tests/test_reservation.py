import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait
from tests.test_main import app


@pytest.mark.usefixtures('app')
class TestSuites:
    HOUR_PICKER_PATH = '//div[@class="ant-picker-time-panel-cell-inner" and text()="{}"]'
    MINUTES_PICKER_PATH = '//div[@class="ant-picker-time-panel-cell-inner" and text()="00"]'
    MAIN_NAME = 'NAME'
    MAIN_SURNAME = 'SURNAME'

    def navigate(self):
        self.driver.find_element(by=By.XPATH, value='//a[@href="/rezervace"]').click()
        WebDriverWait(self.driver, 10).until(
            expected_conditions.presence_of_element_located((By.CLASS_NAME, 'suites'))
        )

    def select_times(self):
        self.driver.find_element(by=By.CLASS_NAME, value='ant-picker').click()
        WebDriverWait(self.driver, 5).until(
            expected_conditions.visibility_of_element_located((By.CLASS_NAME, 'ant-picker-dropdown'))
        )
        self.driver.find_element(by=By.XPATH, value='//div[@class="ant-picker-cell-inner" and text()="1"]').click()
        from_hour = self.driver.find_element(by=By.XPATH, value=self.HOUR_PICKER_PATH.format("15"))
        self.driver.execute_script('arguments[0].scrollIntoView(true)', from_hour)
        from_hour.click()
        from_minutes = self.driver.find_elements(by=By.XPATH, value=self.MINUTES_PICKER_PATH)[1]
        self.driver.execute_script('arguments[0].scrollIntoView(true)', from_minutes)
        from_minutes.click()
        self.driver.find_element(by=By.XPATH, value='//li[@class="ant-picker-ok"]//button').click()
        self.driver.implicitly_wait(5)
        to_hour = self.driver.find_element(by=By.XPATH, value=self.HOUR_PICKER_PATH.format('10'))
        self.driver.execute_script('arguments[0].scrollIntoView(true)', to_hour)
        to_hour.click()
        to_minutes = self.driver.find_elements(by=By.XPATH, value=self.MINUTES_PICKER_PATH)[1]
        self.driver.execute_script('arguments[0].scrollIntoView(true)', to_minutes)
        to_minutes.click()
        self.driver.find_element(by=By.XPATH, value='//li[@class="ant-picker-ok"]//button').click()

    def create_and_select_main_guest(self):
        self.driver.find_element(by=By.ID, value='add-main-guest').click()
        WebDriverWait(self.driver, 5).until(
            expected_conditions.visibility_of_element_located((By.CLASS_NAME, 'guest-drawer'))
        )
        self.driver.find_element(by=By.ID, value='guest_name').send_keys(self.MAIN_NAME)
        self.driver.find_element(by=By.ID, value='guest_surname').send_keys(self.MAIN_SURNAME)
        self.driver.find_element(by=By.ID, value='submit-guest').click()
        WebDriverWait(self.driver, 10).until(
            expected_conditions.visibility_of_element_located((By.CLASS_NAME, 'ant-message'))
        )
        self.driver.find_element(by=By.ID, value='guest').click()
        self.driver.implicitly_wait(2)  # Let the animation roll
        # Guest is being re-fetched, wait for it
        WebDriverWait(self.driver, 10).until(
            expected_conditions.presence_of_element_located(
                (By.XPATH, '//div[@label="{} {}"]'.format(self.MAIN_NAME, self.MAIN_SURNAME)))
        )

    def remove_guest(self):
        pass

    def test_create_reservation(self):
        self.driver.find_element(by=By.CLASS_NAME, value='rct-scroll').click()
        WebDriverWait(self.driver, 5).until(
            expected_conditions.presence_of_element_located((By.CLASS_NAME, 'reservation-modal'))
        )
        self.select_times()
        self.create_and_select_main_guest()
