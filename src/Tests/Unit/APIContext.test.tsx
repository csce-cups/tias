import { screen, render } from '@testing-library/react';
import { APIContext } from '../../Components/APIContext';
import API from '../../modules/API';

jest.mock('../../modules/API');

describe("APIContext", () => {
  it("calls fetchAllStatic on load", () => {
    const fetchAllStatic = jest.spyOn(API, 'fetchAllStatic');
    render(<APIContext ><></></APIContext>);
  })
})