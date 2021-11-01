import pytest
from selenium.webdriver import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait
from tests.test_main import app


@pytest.mark.usefixtures('app')
class TestSuites:
    HOUR_PICKER_PATH = '//div[@class="ant-picker-time-panel-cell-inner" and text()="{}"]'
    MINUTES_PICKER_PATH = '//div[@class="ant-picker-time-panel-cell-inner" and text()="00"]'
    MAIN_NAME = 'NAME'
    ROOMMATE_NAME = 'ROOMMATE'
    SURNAME = 'SURNAME'

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

    def create_guest(self, name, surname):
        self.driver.find_element(by=By.ID, value='add-guest').click()
        WebDriverWait(self.driver, 5).until(
            expected_conditions.visibility_of_element_located((By.CLASS_NAME, 'guest-drawer'))
        )
        self.driver.find_element(by=By.ID, value='guest_name').send_keys(name)
        self.driver.find_element(by=By.ID, value='guest_surname').send_keys(surname)
        self.driver.find_element(by=By.ID, value='submit-guest').click()
        WebDriverWait(self.driver, 10).until(
            expected_conditions.visibility_of_element_located((By.CLASS_NAME, 'ant-message'))
        )

    def remove_guest(self):
        # Close modal first, if opened
        self.driver.find_element(by=By.CSS_SELECTOR, value='button.ant-modal-close').click()
        confirm_close_path = '//div[contains(@class, "ant-popover")]//button//span[contains(text(), "Ok")]//..'
        WebDriverWait(self.driver, 5).until(
            expected_conditions.visibility_of_element_located((By.XPATH, confirm_close_path))
        )
        self.driver.find_element(by=By.XPATH, value=confirm_close_path).click()
        # Navigate to Guests page
        self.driver.find_element(by=By.XPATH, value='//a[@href="/guests"]').click()
        search_input = self.driver.find_element(by=By.ID, value='search-guest')
        search_input.send_keys(self.MAIN_NAME)
        search_input.send_keys(Keys.RETURN)
        self.driver.find_elements(by=By.CLASS_NAME, value='remove-guest')[0].click()
        confirm_delete_path = '//div[contains(@class, "ant-popover")]//button//span[contains(text(), "Ano")]//..'
        WebDriverWait(self.driver, 5).until(
            expected_conditions.visibility_of_element_located((By.XPATH, confirm_delete_path))
        )
        self.driver.find_element(by=By.XPATH, value=confirm_delete_path).click()

    def test_create_reservation(self):
        self.driver.find_element(by=By.CLASS_NAME, value='rct-scroll').click()
        WebDriverWait(self.driver, 5).until(
            expected_conditions.presence_of_element_located((By.CLASS_NAME, 'reservation-modal'))
        )
        self.select_times()
        # self.create_guest(self.MAIN_NAME, self.SURNAME)
        self.driver.find_element(by=By.ID, value='guest').send_keys(self.MAIN_NAME)
        main_guest = self.driver.find_element(by=By.XPATH,
                                              value='//div[@label="{} {}"]'.format(self.MAIN_NAME, self.SURNAME))
        main_guest.click()
        # Create roommate
        self.driver.find_element(by=By.ID, value='add-roommate').click()

        assert len(self.driver.find_elements(by=By.XPATH, value='//input[contains(@id, "roommates")]')) > 0

        # self.create_guest(self.ROOMMATE_NAME, self.SURNAME)
        self.driver.find_element(by=By.CLASS_NAME, value='select-roommate').click()
        self.driver.find_element(by=By.ID, value='roommates_0_id').send_keys(self.ROOMMATE_NAME)
        # Select second occurrence, as first is in main guest dropdown
        self.driver.find_elements(by=By.XPATH,
                                  value='//div[@label="{} {}"]'.format(self.ROOMMATE_NAME, self.SURNAME))[1].click()
        type_open_path = '//input[@id="select-reservation-type"]/ancestor::div[@class="ant-select-selector"]'
        self.driver.find_element(by=By.XPATH, value=type_open_path).click()
        self.driver.find_element(by=By.XPATH, value='//div[@label="Nezávazná rezervace"]').click()
        meal_open_path = '//input[@id="select-reservation-meal"]/ancestor::div[@class="ant-select-selector"]'
        self.driver.find_element(by=By.XPATH, value=meal_open_path).click()
        self.driver.find_element(by=By.XPATH, value='//div[@label="Polopenze"]').click()

        self.driver.find_element(by=By.ID, value='submit-reservation').click()

        self.driver.find_element(by=By.ID, value='reservation-notification-cancel').click()
        self.driver.implicitly_wait(2)  # wait for animation to complete
        assert len(self.driver.find_elements(by=By.XPATH,
                                             value='//div[@title="{} {}"]'.format(self.MAIN_NAME, self.SURNAME))) == 1

        # self.remove_guest()
