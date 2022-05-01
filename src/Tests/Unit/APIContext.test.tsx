import { screen, render, waitFor, act } from "@testing-library/react";
import contexts, { APIContext } from "../../Components/APIContext";
import API from "../../modules/API";
import { APINoAsync } from "../../modules/__mocks__/API";

jest.mock("../../modules/API");

let callback: ((param: any) => void) | "UNINITIALIZED";
let value: any | "UNINITIALIZED";
const caller = (what: React.Context<any>) => {
  const { Consumer } = what;
  return (
    <Consumer>
      {([v, setV]) => {
        callback = (param: any = "TEST DATA") => setV(param);
        value = v;
        return <></>;
      }}
    </Consumer>
  );
};

let getValValue: any | "UNINITIALIZED";
const getVal = (what: React.Context<any>) => {
  const { Consumer } = what;
  return (
    <Consumer>
      {(v) => {
        getValValue = v;
        return <></>;
      }}
    </Consumer>
  );
};

describe("APIContext", () => {
  let fetchAllStatic: jest.SpyInstance<any>;
  let fetchAllUser: jest.SpyInstance<any>;

  const setMocksToResolve = () => {
    fetchAllStatic.mockClear();
    fetchAllUser.mockClear();
    fetchAllStatic.mockRestore();
    fetchAllUser.mockRestore();
  }

  beforeEach(() => {
    fetchAllStatic = jest
      .spyOn(API, "fetchAllStatic")
      .mockImplementation(() => ({
        employees: new Promise<any>((res, rej) => {}),
        blocks: new Promise<any>((res, rej) => {}),
      }));

    fetchAllUser = jest.spyOn(API, "fetchAllUser").mockImplementation(() => ({
      userQuals: new Promise<any>((res, rej) => {}),
      userPrefs: new Promise<any>((res, rej) => {}),
      userViableCourses: new Promise<any>((res, rej) => {}),
      userTrades: new Promise<any>((res, rej) => {}),
    }));
  });

  afterEach(() => {
    fetchAllStatic.mockClear();
    fetchAllUser.mockClear();
    fetchAllStatic.mockRestore();
    fetchAllUser.mockRestore();
    callback = "UNINITIALIZED";
    value = "UNINITIALIZED";
  });

  it("calls fetchAllStatic on load", () => {
    render(
      <APIContext>
        <></>
      </APIContext>
    );

    expect(fetchAllStatic).toHaveBeenCalled();
  });

  test.each`
    context                       | name
    ${contexts.employees}         | ${"employees"}
    ${contexts.blocks}            | ${"blocks"}
    ${contexts.loadedSchedule}    | ${"loadedSchedule"}
    ${contexts.userQuals}         | ${"userQuals"}
    ${contexts.userPrefs}         | ${"userPrefs"}
    ${contexts.userViableCourses} | ${"userViableCourses"}
    ${contexts.userTrades}        | ${"userTrades"}
  `("caches the data for $name", async ({ context }) => {
    setMocksToResolve();
    expect(value).toBe("UNINITIALIZED");

    render(
      <APIContext>
        {caller(context)}
      </APIContext>
    );

    const prev = value;
    expect(value).not.toBe("UNINITIALIZED");
    await waitFor(() => {
      expect(value).not.toBe(prev);
    })
  });

  it("calls fetchAllUser on login", () => {
    render(<APIContext>{caller(contexts.googleData)}</APIContext>);
    act(() => (callback as () => void)());
    expect(fetchAllUser).toHaveBeenCalledTimes(2);
  });

  it("resolves the user on login", async () => {
    setMocksToResolve();
    fetchAllStatic = jest
      .spyOn(API, "fetchAllStatic")
      .mockImplementation(() => ({
        employees: new Promise(r => r([...APINoAsync.fetchEveryone(), {
          person_id: 999_999, 
          email: "MASTER@tamu.edu",
          first_name: "MASTER", 
          last_name: "USER",
          profile_photo_url: "",
          peer_teacher: true,
          teaching_assistant: true,
          administrator: true,
          professor: true,
          isScheduled: null,
          isChecked: true,
          desired_number_assignments: 2
        }])),
        blocks: new Promise<any>((res, rej) => {}),
      }));

    render(
      <APIContext>
        {caller(contexts.googleData)}
        {getVal(contexts.user)}
      </APIContext>
    );
    act(() => (callback as (params: any) => void)({tias_user_id: "999999"}));
    
    await waitFor(() => {
      expect(getValValue.user).toBeTruthy();
    });
  });

  it("resolves the user from the cookie", async () => {
    setMocksToResolve();
    fetchAllStatic = jest
      .spyOn(API, "fetchAllStatic")
      .mockImplementation(() => ({
        employees: new Promise(r => r([...APINoAsync.fetchEveryone(), {
          person_id: 999_999, 
          email: "MASTER@tamu.edu",
          first_name: "MASTER", 
          last_name: "USER",
          profile_photo_url: "",
          peer_teacher: true,
          teaching_assistant: true,
          administrator: true,
          professor: true,
          isScheduled: null,
          isChecked: true,
          desired_number_assignments: 2
        }])),
        blocks: new Promise<any>((res, rej) => res([])),
      }));
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: 'tias_user_id=999999',
    });

    render(
      <APIContext>
        {getVal(contexts.user)}
      </APIContext>
    );
    
    await waitFor(() => {
      expect(getValValue.user).toBeTruthy();
    });
  })

  test.each`
    context                       | name
    ${contexts.googleData}        | ${"googleData"}
    ${contexts.employees}         | ${"employees"}
    ${contexts.blocks}            | ${"blocks"}
    ${contexts.loadedSchedule}    | ${"loadedSchedule"}
    ${contexts.allViableCourses}  | ${"allViableCourses"}
    ${contexts.userQuals}         | ${"userQuals"}
    ${contexts.userPrefs}         | ${"userPrefs"}
    ${contexts.userViableCourses} | ${"userViableCourses"}
    ${contexts.userTrades}        | ${"userTrades"}
  `("gets angry when default setter is called for $name", ({ context, name }) => {
    const errorlog = jest.spyOn(console, "error").mockImplementation(() => {});

    render(caller(context));

    act(() => (callback as () => void)());

    expect(errorlog).toHaveBeenCalledWith(`ERR: Default context triggered for ${name}. Please rememeber to pass a state with a context provider`);
    errorlog.mockReset();
    errorlog.mockRestore();
  });
});
