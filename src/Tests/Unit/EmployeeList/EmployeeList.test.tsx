import { render, screen } from "@testing-library/react";
import { EmployeeList } from "../../../Components/EmployeeList/EmployeeList";
import { Person } from "../../../modules/API";
import contexts, { APIContext } from "../../../Components/APIContext";

jest.mock("../../../Components/APIContext");
jest.mock("../../../Components/EmployeeList/EmployeeRow");
jest.mock("../../../Components/EmployeeList/GenerateButton");
jest.mock("../../../Components/EmployeeList/LoadButton");
jest.mock("../../../Components/EmployeeList/EditButton");
jest.mock("../../../Components/EmployeeList/SaveButton");

describe("EmployeeList", () => {
  const employees: Person[] = [
    {
      person_id: 1,
      first_name: "Abby",
      last_name: "Zebra",
      email: "",
      profile_photo_url: "",
      peer_teacher: true,
      teaching_assistant: false,
      administrator: false,
      professor: false,
      isScheduled: true,
      isChecked: true,
      desired_number_assignments: 2,
    },
    {
      person_id: 2,
      first_name: "Billy",
      last_name: "Yvetal",
      email: "",
      profile_photo_url: "",
      peer_teacher: true,
      teaching_assistant: false,
      administrator: false,
      professor: false,
      isScheduled: false,
      isChecked: true,
      desired_number_assignments: 2,
    },
    {
      person_id: 3,
      first_name: "Carl",
      last_name: "Xylyx",
      email: "",
      profile_photo_url: "",
      peer_teacher: true,
      teaching_assistant: false,
      administrator: false,
      professor: false,
      isScheduled: true,
      isChecked: true,
      desired_number_assignments: 2,
    },
    {
      person_id: 4,
      first_name: "Dan",
      last_name: "Willy",
      email: "",
      profile_photo_url: "",
      peer_teacher: true,
      teaching_assistant: false,
      administrator: false,
      professor: false,
      isScheduled: false,
      isChecked: true,
      desired_number_assignments: 2,
    },
  ];

  describe("content", () => {
    it("lists all employees", () => {
      render(
        <APIContext>
          <contexts.employees.Provider value={[employees, () => {}]}>
            <EmployeeList editingState={{
              bool: [false, () => {}],
              count: [0, () => {}],
            }}/>
          </contexts.employees.Provider>
        </APIContext>
      );
  
      expect(screen.getByText("Abby Zebra")).toBeInTheDocument();
      expect(screen.getByText("Billy Yvetal")).toBeInTheDocument();
      expect(screen.getByText("Carl Xylyx")).toBeInTheDocument();
      expect(screen.getByText("Dan Willy")).toBeInTheDocument();
    });

    it("shows unscheduled peer teachers", () => {
      render(
        <APIContext>
          <contexts.employees.Provider value={[employees, () => {}]}>
            <EmployeeList editingState={{
              bool: [false, () => {}],
              count: [0, () => {}],
            }}/>
          </contexts.employees.Provider>
        </APIContext>
      );

      expect(screen.getByText("2 unscheduled peer teachers")).toBeInTheDocument();
    });

    it("sorts the employees by last name", () => {
      render(
        <APIContext>
          <contexts.employees.Provider value={[employees, () => {}]}>
            <EmployeeList editingState={{
              bool: [false, () => {}],
              count: [0, () => {}],
            }}/>
          </contexts.employees.Provider>
        </APIContext>
      );
      
      const rows = screen.getAllByTestId("EmployeeRow");
      expect(rows[0].textContent).toBe("Dan Willy");
      expect(rows[1].textContent).toBe("Carl Xylyx");
      expect(rows[2].textContent).toBe("Billy Yvetal");
      expect(rows[3].textContent).toBe("Abby Zebra");
    })

    it("sorts the employees by fist name when selected", () => {
      render(
        <APIContext>
          <contexts.employees.Provider value={[employees, () => {}]}>
            <EmployeeList editingState={{
              bool: [false, () => {}],
              count: [0, () => {}],
            }}/>
          </contexts.employees.Provider>
        </APIContext>
      );

      const firstNameSortBtn = screen.getByText("First Name");
      firstNameSortBtn.click();
      
      const rows = screen.getAllByTestId("EmployeeRow");
      expect(rows[0].textContent).toBe("Abby Zebra");
      expect(rows[1].textContent).toBe("Billy Yvetal");
      expect(rows[2].textContent).toBe("Carl Xylyx");
      expect(rows[3].textContent).toBe("Dan Willy");
    })

    it("sorts the employees by lastname name when selected", () => {
      render(
        <APIContext>
          <contexts.employees.Provider value={[employees, () => {}]}>
            <EmployeeList editingState={{
              bool: [false, () => {}],
              count: [0, () => {}],
            }}/>
          </contexts.employees.Provider>
        </APIContext>
      );

      const firstNameSortBtn = screen.getByText("First Name");
      const lastNameSortBtn = screen.getByText("Last Name");
      
      firstNameSortBtn.click();
      let rows = screen.getAllByTestId("EmployeeRow");
      expect(rows[0].textContent).toBe("Abby Zebra");
      expect(rows[1].textContent).toBe("Billy Yvetal");
      expect(rows[2].textContent).toBe("Carl Xylyx");
      expect(rows[3].textContent).toBe("Dan Willy");
      
      lastNameSortBtn.click();
      rows = screen.getAllByTestId("EmployeeRow");
      expect(rows[0].textContent).toBe("Dan Willy");
      expect(rows[1].textContent).toBe("Carl Xylyx");
      expect(rows[2].textContent).toBe("Billy Yvetal");
      expect(rows[3].textContent).toBe("Abby Zebra");
    })
  })

  describe("buttons", () => {
    it("has a generate button", () => {
      render(
        <APIContext>
          <EmployeeList editingState={{
            bool: [false, () => {}],
            count: [0, () => {}],
          }}/>
        </APIContext>
      );
  
      expect(screen.getByTestId("GenerateButton")).toBeInTheDocument();
    });
  
    it("has an edit button", () => {
      render(
        <APIContext>
          <EmployeeList editingState={{
            bool: [false, () => {}],
            count: [0, () => {}],
          }}/>
        </APIContext>
      );
  
      expect(screen.getByTestId("EditButton")).toBeInTheDocument();
    });
  
    it("has a save button", () => {
      render(
        <APIContext>
          <EmployeeList editingState={{
            bool: [false, () => {}],
            count: [0, () => {}],
          }}/>
        </APIContext>
      );
  
      expect(screen.getByTestId("SaveButton")).toBeInTheDocument();
    });
  });
});
