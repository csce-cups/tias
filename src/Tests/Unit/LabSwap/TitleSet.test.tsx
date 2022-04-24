import { render, screen } from "@testing-library/react";
import { TitleSet } from "../../../Components/LabSwap/TitleSet";

describe("TitleSet", ()=>{
    const titles:[string, string] = ["Test1", "Test2"];
    describe("content", ()=> {
        it("contains correct titles", ()=>{
            render(<TitleSet titles={titles}/>);
            expect(screen.getByText("Test1")).toBeInTheDocument();
            expect(screen.getByText("Test2")).toBeInTheDocument();
        });
    })
})
