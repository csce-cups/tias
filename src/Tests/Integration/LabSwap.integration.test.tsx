import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import contexts, { APIContext } from '../../Components/APIContext';
import { LabSwap } from '../../Components/LabSwap/LabSwap';
import API, { CourseBlockWeek, CourseBlockWeekKey, Person, TradeRequest } from '../../modules/API';
import { APINoAsync } from '../../modules/__mocks__/API';
import { LabSwapPage } from '../../pages/LabSwapPage';
import { ContextSetterSpy } from '../helpers/ContextSetterSpy';

jest.mock('../../Components/APIContext');
jest.mock('../../modules/API');

describe("LabSwap Integration", () => {
  const person: Person = {
    ...APINoAsync.fetchPTList()[0],
    peer_teacher: true,
    teaching_assistant: true,
    professor: true,
    administrator: true
  };
  
  const week = APINoAsync.fetchCourseBlocks();
  const block = {...week.Wednesday![0], scheduled: [person.person_id]};
  const data: CourseBlockWeek = {
    Monday: week.Monday!.map((b, i) => ({...b, scheduled: [i%3? person.person_id : -1]})).sort((a, b) => a.section_id % 3 - 1 + b.section_id % 3),
    Tuesday: week.Tuesday!.map((b, i) => ({...b, scheduled: [i%3? person.person_id : -1]})).sort((a, b) => a.section_id % 3 - 1 + b.section_id % 3),
    Wednesday: [block, ...week.Wednesday!.map((b, i) => ({...b, scheduled: [i%3? person.person_id : -1]})).sort((a, b) => a.section_id % 3 - 1 + b.section_id % 3).filter((_, i) => i !== 0)],
    Thursday: week.Thursday!.map((b, i) => ({...b, scheduled: [i%3? person.person_id : -1]})).sort((a, b) => a.section_id % 3 - 1 + b.section_id % 3),
    Friday: week.Friday!.map((b, i) => ({...b, scheduled: [i%3? person.person_id : -1]})).sort((a, b) => a.section_id % 3 - 1 + b.section_id % 3),
  };
  
  const schedule = new Map((
    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as CourseBlockWeekKey[])
      .map(day => data[day]?.map(b => [b.section_id.toString(), b.scheduled]) as [string, number[]][] || [])
      .flat()
  );

  describe("bootstrap page", () => {
    it('has a bootstrap page', () => {
      render(
        <APIContext>
          < contexts.user.Provider value={{user: person, doShowAdmin: true, doShowLabSwap: true, doShowProfile: true, doShowScheduling: true}} >
            <LabSwapPage />
          </contexts.user.Provider>
        </APIContext>
      );
  
      expect(screen.getByText(/Offer/i)).toBeInTheDocument();
    });

    it('says loading while the user loads', () => {
      render(
        <APIContext>
          <LabSwapPage />
        </APIContext>
      );
  
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("disallows access if the user doesn't have permission", () => {
      render(
        <APIContext>
          < contexts.user.Provider value={{user: person, doShowAdmin: true, doShowLabSwap: false, doShowProfile: true, doShowScheduling: true}} >
            <LabSwapPage />
          </contexts.user.Provider>
        </APIContext>
      );
  
      expect(screen.getByText(/You do not have permission to visit this page./i)).toBeInTheDocument();
    })
  })

  describe("submitting a trade", () => {
    it("can submit a trade", async () => {
      const spy = jest.spyOn(API, 'submitTrade').mockImplementation(() => new Promise<void>(r => {}));
      render(
        < APIContext >
          < contexts.user.Provider value={{user: person, doShowAdmin: true, doShowLabSwap: true, doShowProfile: true, doShowScheduling: true}} >
            < ContextSetterSpy what={contexts.userViableCourses} value={data} >
              < ContextSetterSpy what={contexts.loadedSchedule} value={schedule} >
                < LabSwap />
              </ContextSetterSpy>
            </ContextSetterSpy>
          </contexts.user.Provider>
        </ APIContext >
      );
  
      const submit_button = screen.getByRole('button', {name: /request trade/i});
      expect(submit_button).toBeDisabled();
  
      // Selecting something to offer
      const offer_block = screen.getAllByText(block.course_number.toString()).filter(b => b.parentElement?.parentElement?.parentElement?.parentElement?.textContent?.startsWith(block.weekday))[0];
      offer_block.click();
      
      expect(screen.getByText(/select course to offer/i)).toBeInTheDocument();
      const offerbtn = screen.getByRole('button', {name: /offer selected section/i})
      expect(offerbtn).toBeDisabled();
      screen.getByLabelText(new RegExp(`${block.course_number}-${block.section_number}`)).click();
      expect(offerbtn).not.toBeDisabled();
      offerbtn.click();
      userEvent.click(document.body);
  
      // Selecting something to request
      const req_block = data.Monday!.filter(b => !b.scheduled?.includes(person.person_id))[0];
      const request_block = screen.getAllByText(req_block.course_number.toString()).filter(b => b.parentElement?.parentElement?.parentElement?.parentElement?.textContent?.startsWith(req_block.weekday))[0];
      request_block.click();
  
      expect(screen.getByText(/select course to request/i)).toBeInTheDocument();
      const reqbtn = screen.getByRole('button', {name: /request selected section/i})
      expect(reqbtn).toBeDisabled();
      screen.getByLabelText(new RegExp(`${req_block.course_number}-${req_block.section_number}`)).click();
      expect(reqbtn).not.toBeDisabled();
      reqbtn.click();
      userEvent.click(document.body);
  
      // Making the request
      expect(submit_button).not.toBeDisabled();
      act(() => submit_button.click());
  
      // Check the API is called
      expect(spy).toHaveBeenCalled();
    });

    it("can automatically accept a trade", async () => {
      const msg = "success";
      const submitSpy = jest.spyOn(API, 'submitTrade').mockImplementation(() => Promise.resolve({msg}));
      const fetchSpy = jest.spyOn(API, 'fetchUserTrades').mockImplementation(() => Promise.resolve([]));
      const tradeUpdateFn = jest.fn();
      const alert = jest.spyOn(window, 'alert').mockImplementation(() => {});
      render(
        < APIContext >
          < contexts.user.Provider value={{user: person, doShowAdmin: true, doShowLabSwap: true, doShowProfile: true, doShowScheduling: true}} >
            < ContextSetterSpy what={contexts.userViableCourses} value={data} >
              < ContextSetterSpy what={contexts.loadedSchedule} value={schedule} >
                < ContextSetterSpy what={contexts.userTrades} spy={tradeUpdateFn} >
                  < LabSwap />
                </ ContextSetterSpy >
              </ContextSetterSpy>
            </ContextSetterSpy>
          </contexts.user.Provider>
        </ APIContext >
      );
  
      const submit_button = screen.getByRole('button', {name: /request trade/i});
      expect(submit_button).toBeDisabled();
  
      // Selecting something to offer
      const offer_block = screen.getAllByText(block.course_number.toString()).filter(b => b.parentElement?.parentElement?.parentElement?.parentElement?.textContent?.startsWith(block.weekday))[0];
      offer_block.click();
      
      expect(screen.getByText(/select course to offer/i)).toBeInTheDocument();
      const offerbtn = screen.getByRole('button', {name: /offer selected section/i})
      expect(offerbtn).toBeDisabled();
      screen.getByLabelText(new RegExp(`${block.course_number}-${block.section_number}`)).click();
      expect(offerbtn).not.toBeDisabled();
      offerbtn.click();
      userEvent.click(document.body);
  
      // Selecting something to request
      const req_block = data.Monday!.filter(b => !b.scheduled?.includes(person.person_id))[0];
      const request_block = screen.getAllByText(req_block.course_number.toString()).filter(b => b.parentElement?.parentElement?.parentElement?.parentElement?.textContent?.startsWith(req_block.weekday))[0];
      request_block.click();
  
      expect(screen.getByText(/select course to request/i)).toBeInTheDocument();
      const reqbtn = screen.getByRole('button', {name: /request selected section/i})
      expect(reqbtn).toBeDisabled();
      screen.getByLabelText(new RegExp(`${req_block.course_number}-${req_block.section_number}`)).click();
      expect(reqbtn).not.toBeDisabled();
      reqbtn.click();
      userEvent.click(document.body);
  
      // Making the request
      expect(submit_button).not.toBeDisabled();
      act(() => submit_button.click());
  
      // Check the API is called
      expect(submitSpy).toHaveBeenCalled();

      await waitFor(() => {
        expect(alert).toHaveBeenCalledWith(msg);
      });

      await waitFor(() => {
        expect(fetchSpy).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(tradeUpdateFn).toHaveBeenCalled();
      }, { timeout: 1501 });
    });

    it("can automatically reject a trade", async () => {
      const err = "error";
      const spy = jest.spyOn(API, 'submitTrade').mockImplementation(() => Promise.resolve({err}));
      const alert = jest.spyOn(window, 'alert').mockImplementation(() => {});
      render(
        < APIContext >
          < contexts.user.Provider value={{user: person, doShowAdmin: true, doShowLabSwap: true, doShowProfile: true, doShowScheduling: true}} >
            < ContextSetterSpy what={contexts.userViableCourses} value={data} >
              < ContextSetterSpy what={contexts.loadedSchedule} value={schedule} >
                < LabSwap />
              </ContextSetterSpy>
            </ContextSetterSpy>
          </contexts.user.Provider>
        </ APIContext >
      );
  
      const submit_button = screen.getByRole('button', {name: /request trade/i});
      expect(submit_button).toBeDisabled();
  
      // Selecting something to offer
      const offer_block = screen.getAllByText(block.course_number.toString()).filter(b => b.parentElement?.parentElement?.parentElement?.parentElement?.textContent?.startsWith(block.weekday))[0];
      offer_block.click();
      
      expect(screen.getByText(/select course to offer/i)).toBeInTheDocument();
      const offerbtn = screen.getByRole('button', {name: /offer selected section/i})
      expect(offerbtn).toBeDisabled();
      screen.getByLabelText(new RegExp(`${block.course_number}-${block.section_number}`)).click();
      expect(offerbtn).not.toBeDisabled();
      offerbtn.click();
      userEvent.click(document.body);
  
      // Selecting something to request
      const req_block = data.Monday!.filter(b => !b.scheduled?.includes(person.person_id))[0];
      const request_block = screen.getAllByText(req_block.course_number.toString()).filter(b => b.parentElement?.parentElement?.parentElement?.parentElement?.textContent?.startsWith(req_block.weekday))[0];
      request_block.click();
  
      expect(screen.getByText(/select course to request/i)).toBeInTheDocument();
      const reqbtn = screen.getByRole('button', {name: /request selected section/i})
      expect(reqbtn).toBeDisabled();
      screen.getByLabelText(new RegExp(`${req_block.course_number}-${req_block.section_number}`)).click();
      expect(reqbtn).not.toBeDisabled();
      reqbtn.click();
      userEvent.click(document.body);
  
      // Making the request
      expect(submit_button).not.toBeDisabled();
      act(() => submit_button.click());
  
      // Check the API is called
      expect(spy).toHaveBeenCalled();

      await waitFor(() => {
        expect(alert).toHaveBeenCalledWith(err);
      })
    });
  });

  describe("interacting with trades", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("can cancel a trade", async () => {
      const updateTrade = jest.spyOn(API, 'updateTrade').mockImplementation(() => Promise.resolve());
      const setUserTrades = jest.fn();
      const trade: TradeRequest = { 
        person_id_sender: person.person_id,
        section_id_sender: block.section_id,
        person_id_receiver: person.person_id + 1,
        section_id_receiver: block.section_id + 1,
        request_status: "Pending"
      }

      render(
        < APIContext >
          < contexts.user.Provider value={{user: person, doShowAdmin: true, doShowLabSwap: true, doShowProfile: true, doShowScheduling: true}} >
            < ContextSetterSpy what={contexts.userViableCourses} value={data} >
              < ContextSetterSpy what={contexts.userTrades} value={[trade]} spy={setUserTrades} >
                < LabSwap />
              </ContextSetterSpy>
            </ContextSetterSpy>
          </contexts.user.Provider>
        </ APIContext >
      );

      const cancelbtn = screen.getByRole('button', {name: /cancel/i});
      expect(cancelbtn).toBeInTheDocument();
      cancelbtn.click();

      expect(updateTrade).toHaveBeenCalled();
    });

    it("can accept a trade", async () => {
      const updateTrade = jest.spyOn(API, 'updateTrade').mockImplementation(() => Promise.resolve());
      const setUserTrades = jest.fn();
      const trade: TradeRequest = { 
        person_id_sender: person.person_id + 1,
        section_id_sender: block.section_id + 1,
        person_id_receiver: person.person_id,
        section_id_receiver: block.section_id,
        request_status: "Pending"
      }

      render(
        < APIContext >
          < contexts.user.Provider value={{user: person, doShowAdmin: true, doShowLabSwap: true, doShowProfile: true, doShowScheduling: true}} >
            < ContextSetterSpy what={contexts.userViableCourses} value={data} >
              < ContextSetterSpy what={contexts.userTrades} value={[trade]} spy={setUserTrades} >
                < LabSwap />
              </ContextSetterSpy>
            </ContextSetterSpy>
          </contexts.user.Provider>
        </ APIContext >
      );

      const cancelbtn = screen.getByRole('button', {name: /accept/i});
      expect(cancelbtn).toBeInTheDocument();
      cancelbtn.click();

      expect(updateTrade).toHaveBeenCalled();
    });

    it("can reject a trade", async () => {
      const updateTrade = jest.spyOn(API, 'updateTrade').mockImplementation(() => Promise.resolve());
      const setUserTrades = jest.fn();
      const trade: TradeRequest = { 
        person_id_sender: person.person_id + 1,
        section_id_sender: block.section_id + 1,
        person_id_receiver: person.person_id,
        section_id_receiver: block.section_id,
        request_status: "Pending"
      }

      render(
        < APIContext >
          < contexts.user.Provider value={{user: person, doShowAdmin: true, doShowLabSwap: true, doShowProfile: true, doShowScheduling: true}} >
            < ContextSetterSpy what={contexts.userViableCourses} value={data} >
              < ContextSetterSpy what={contexts.userTrades} value={[trade]} spy={setUserTrades} >
                < LabSwap />
              </ContextSetterSpy>
            </ContextSetterSpy>
          </contexts.user.Provider>
        </ APIContext >
      );

      const cancelbtn = screen.getByRole('button', {name: /reject/i});
      expect(cancelbtn).toBeInTheDocument();
      cancelbtn.click();

      expect(updateTrade).toHaveBeenCalled();
    });
  })
});