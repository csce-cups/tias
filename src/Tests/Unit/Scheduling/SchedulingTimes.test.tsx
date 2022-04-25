import { render, screen } from '@testing-library/react';
import { SchedulingTimes } from '../../../Components/Scheduling/SchedulingTimes';
import { formatDate } from '../../../modules/BlockFunctions';

describe("SchedulingTimes", () => {
  let hours = 12;
  let start = new Date((8+6)*60*60*1000);
  it("exists", () => {
    render(<SchedulingTimes start={start} hours={hours}/>);
  });

  it("lists the times", () => {
    render(<SchedulingTimes start={start} hours={hours}/>);
    Array.from(Array(hours).keys()).map(i => (i+14)*60*60*1000).forEach(t => {
      expect(screen.getByText(formatDate(new Date(t)))).toBeInTheDocument();
    })
  })
})