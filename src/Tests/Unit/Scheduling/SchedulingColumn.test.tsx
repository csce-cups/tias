import React from 'react';
import { render, screen } from '@testing-library/react';
import { SchedulingColumn } from '../../../Components/Scheduling/SchedulingColumn';
import BlockFormer from '../../../Components/Scheduling/BlockFormer'

describe('SchedulingColumn (SchedulingBlock Dependent)', () => {
    it('exists', () => {
        render(< SchedulingColumn blocks={[
            {course: 121, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
        ]} />);
    });
    
    describe('Single elements', () => {
        it('displays one short element', () => {
            render(< SchedulingColumn blocks={[
                {course: 121, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
            ]}/>)
            
            const element = screen.getByText(/101/);
            expect(element).toBeInTheDocument();
        });
        
        it('displays one medium element', () => {
            render(< SchedulingColumn blocks={[
                {course: 121, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_long},
            ]}/>)
            
            const element = screen.getByText(/101/);
            expect(element).toBeInTheDocument();
        });
        
        it('displays one short element', () => {
            render(< SchedulingColumn blocks={[
                {course: 121, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_extralong},
            ]}/>)
            
            const element = screen.getByText(/101/);
            expect(element).toBeInTheDocument();
        });
    });

    describe('Multiple elements', () => {
        describe('Same starting time', () => {
            describe('Same Size', () => {
                it('displays small elements', () => {
                    render(< SchedulingColumn blocks={[
                        {course: 121, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
                        {course: 121, section: 102, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
                        {course: 121, section: 103, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
                    ]}/>)
    
                    expect(screen.getByText(/101/)).toBeInTheDocument();
                    expect(screen.getByText(/102/)).toBeInTheDocument();
                    expect(screen.getByText(/103/)).toBeInTheDocument();
                });

                it('displays medium elements', () => {
                    render(< SchedulingColumn blocks={[
                        {course: 121, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_long},
                        {course: 121, section: 102, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_long},
                        {course: 121, section: 103, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_long},
                    ]}/>)
    
                    expect(screen.getByText(/101/)).toBeInTheDocument();
                    expect(screen.getByText(/102/)).toBeInTheDocument();
                    expect(screen.getByText(/103/)).toBeInTheDocument();
                });

                it('displays large elements', () => {
                    render(< SchedulingColumn blocks={[
                        {course: 121, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_extralong},
                        {course: 121, section: 102, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_extralong},
                        {course: 121, section: 103, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_extralong},
                    ]}/>)
                    
                    expect(screen.getByText(/101/)).toBeInTheDocument();
                    expect(screen.getByText(/102/)).toBeInTheDocument();
                    expect(screen.getByText(/103/)).toBeInTheDocument();
                });

            });
    
            describe('2 Different Sizes', () => {
                it('displays small and medium elements', () => {
                    render(< SchedulingColumn blocks={[
                        {course: 121, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
                        {course: 121, section: 102, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_long},
                        {course: 121, section: 103, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_long},
                        {course: 121, section: 104, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
                        {course: 121, section: 105, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
                    ]}/>)
                    
                    expect(screen.getByText(/101/)).toBeInTheDocument();
                    expect(screen.getByText(/102/)).toBeInTheDocument();
                    expect(screen.getByText(/103/)).toBeInTheDocument();
                    expect(screen.getByText(/104/)).toBeInTheDocument();
                    expect(screen.getByText(/105/)).toBeInTheDocument();
                });

                it('displays small and large elements', () => {
                    render(< SchedulingColumn blocks={[
                        {course: 121, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
                        {course: 121, section: 102, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_extralong},
                        {course: 121, section: 103, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
                        {course: 121, section: 104, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_extralong},
                        {course: 121, section: 105, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
                    ]}/>)
    
                    expect(screen.getByText(/101/)).toBeInTheDocument();
                    expect(screen.getByText(/102/)).toBeInTheDocument();
                    expect(screen.getByText(/103/)).toBeInTheDocument();
                    expect(screen.getByText(/104/)).toBeInTheDocument();
                    expect(screen.getByText(/105/)).toBeInTheDocument();
                });

                it('displays medium and large elements', () => {
                    render(< SchedulingColumn blocks={[
                        {course: 121, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_long},
                        {course: 121, section: 102, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_long},
                        {course: 121, section: 103, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_extralong},
                        {course: 121, section: 104, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_extralong},
                        {course: 121, section: 105, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_long},
                    ]}/>)
    
                    expect(screen.getByText(/101/)).toBeInTheDocument();
                    expect(screen.getByText(/102/)).toBeInTheDocument();
                    expect(screen.getByText(/103/)).toBeInTheDocument();
                    expect(screen.getByText(/104/)).toBeInTheDocument();
                    expect(screen.getByText(/105/)).toBeInTheDocument();
                });
            });
        })

        describe('Different starting times', () => {
            describe('Same Size', () => {
                it('displays small elements', () => {
                    render(< SchedulingColumn blocks={[
                        {course: 121, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
                        {course: 121, section: 104, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_short},
                        {course: 121, section: 102, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
                        {course: 121, section: 105, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_short},
                        {course: 121, section: 103, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
                        {course: 121, section: 106, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_short},
                    ]}/>)
    
                    expect(screen.getByText(/101/)).toBeInTheDocument();
                    expect(screen.getByText(/102/)).toBeInTheDocument();
                    expect(screen.getByText(/103/)).toBeInTheDocument();
                    expect(screen.getByText(/104/)).toBeInTheDocument();
                    expect(screen.getByText(/105/)).toBeInTheDocument();
                    expect(screen.getByText(/106/)).toBeInTheDocument();
                });

                it('displays medium elements', () => {
                    render(< SchedulingColumn blocks={[
                        {course: 121, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_long},
                        {course: 121, section: 104, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_long},
                        {course: 121, section: 102, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_long},
                        {course: 121, section: 105, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_long},
                        {course: 121, section: 103, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_long},
                        {course: 121, section: 106, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_long},
                    ]}/>)
    
                    expect(screen.getByText(/101/)).toBeInTheDocument();
                    expect(screen.getByText(/102/)).toBeInTheDocument();
                    expect(screen.getByText(/103/)).toBeInTheDocument();
                    expect(screen.getByText(/104/)).toBeInTheDocument();
                    expect(screen.getByText(/105/)).toBeInTheDocument();
                    expect(screen.getByText(/106/)).toBeInTheDocument();
                });

                it('displays large elements', () => {
                    render(< SchedulingColumn blocks={[
                        {course: 121, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_extralong},
                        {course: 121, section: 104, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_extralong},
                        {course: 121, section: 102, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_extralong},
                        {course: 121, section: 105, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_extralong},
                        {course: 121, section: 103, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_extralong},
                        {course: 121, section: 106, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_extralong},
                    ]}/>)
                    
                    expect(screen.getByText(/101/)).toBeInTheDocument();
                    expect(screen.getByText(/102/)).toBeInTheDocument();
                    expect(screen.getByText(/103/)).toBeInTheDocument();
                    expect(screen.getByText(/104/)).toBeInTheDocument();
                    expect(screen.getByText(/105/)).toBeInTheDocument();
                    expect(screen.getByText(/106/)).toBeInTheDocument();
                });
            })
    
            describe('2 Different Sizes', () => {
                it('displays small and medium elements', () => {
                    render(< SchedulingColumn blocks={[
                        {course: 121, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
                        {course: 121, section: 104, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_short},
                        {course: 121, section: 102, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
                        {course: 121, section: 105, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_short},
                        {course: 121, section: 103, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
                        {course: 121, section: 106, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_short},
                        {course: 121, section: 107, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_long},
                        {course: 121, section: 108, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_long},
                        {course: 121, section: 109, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_long},
                        {course: 121, section: 110, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_long},
                        {course: 121, section: 111, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_long},
                        {course: 121, section: 112, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_long},
                    ]}/>)
    
                    expect(screen.getByText(/101/)).toBeInTheDocument();
                    expect(screen.getByText(/102/)).toBeInTheDocument();
                    expect(screen.getByText(/103/)).toBeInTheDocument();
                    expect(screen.getByText(/104/)).toBeInTheDocument();
                    expect(screen.getByText(/105/)).toBeInTheDocument();
                    expect(screen.getByText(/106/)).toBeInTheDocument();
                    expect(screen.getByText(/107/)).toBeInTheDocument();
                    expect(screen.getByText(/108/)).toBeInTheDocument();
                    expect(screen.getByText(/109/)).toBeInTheDocument();
                    expect(screen.getByText(/110/)).toBeInTheDocument();
                    expect(screen.getByText(/111/)).toBeInTheDocument();
                    expect(screen.getByText(/112/)).toBeInTheDocument();
                });

                it('displays small and large elements', () => {
                    render(< SchedulingColumn blocks={[
                        {course: 121, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
                        {course: 121, section: 104, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_short},
                        {course: 121, section: 102, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
                        {course: 121, section: 105, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_short},
                        {course: 121, section: 103, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
                        {course: 121, section: 106, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_short},
                        {course: 121, section: 107, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_extralong},
                        {course: 121, section: 108, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_extralong},
                        {course: 121, section: 109, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_extralong},
                        {course: 121, section: 110, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_extralong},
                        {course: 121, section: 111, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_extralong},
                        {course: 121, section: 112, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_extralong},
                    ]}/>)
    
                    expect(screen.getByText(/101/)).toBeInTheDocument();
                    expect(screen.getByText(/102/)).toBeInTheDocument();
                    expect(screen.getByText(/103/)).toBeInTheDocument();
                    expect(screen.getByText(/104/)).toBeInTheDocument();
                    expect(screen.getByText(/105/)).toBeInTheDocument();
                    expect(screen.getByText(/106/)).toBeInTheDocument();
                    expect(screen.getByText(/107/)).toBeInTheDocument();
                    expect(screen.getByText(/108/)).toBeInTheDocument();
                    expect(screen.getByText(/109/)).toBeInTheDocument();
                    expect(screen.getByText(/110/)).toBeInTheDocument();
                    expect(screen.getByText(/111/)).toBeInTheDocument();
                });

                it('displays medium and large elements', () => {
                    render(< SchedulingColumn blocks={[
                        {course: 121, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_extralong},
                        {course: 121, section: 104, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_extralong},
                        {course: 121, section: 102, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_extralong},
                        {course: 121, section: 105, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_extralong},
                        {course: 121, section: 103, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_extralong},
                        {course: 121, section: 106, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_extralong},
                        {course: 121, section: 107, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_long},
                        {course: 121, section: 108, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_long},
                        {course: 121, section: 109, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_long},
                        {course: 121, section: 110, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_long},
                        {course: 121, section: 111, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_long},
                        {course: 121, section: 112, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_long},
                    ]}/>)
                    
                    expect(screen.getByText(/101/)).toBeInTheDocument();
                    expect(screen.getByText(/102/)).toBeInTheDocument();
                    expect(screen.getByText(/103/)).toBeInTheDocument();
                    expect(screen.getByText(/104/)).toBeInTheDocument();
                    expect(screen.getByText(/105/)).toBeInTheDocument();
                    expect(screen.getByText(/106/)).toBeInTheDocument();
                    expect(screen.getByText(/107/)).toBeInTheDocument();
                    expect(screen.getByText(/108/)).toBeInTheDocument();
                    expect(screen.getByText(/109/)).toBeInTheDocument();
                    expect(screen.getByText(/110/)).toBeInTheDocument();
                    expect(screen.getByText(/111/)).toBeInTheDocument();
                });

                it('displays differently sized elements at different times', () => {
                    render(< SchedulingColumn blocks={[
                        {course: 121, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
                        {course: 121, section: 102, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_long},
                        
                        {course: 121, section: 103, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_short},
                        {course: 121, section: 104, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_extralong},

                        {course: 121, section: 105, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_long},
                        {course: 121, section: 106, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_extralong},
                    ]}/>)
                    
                    expect(screen.getByText(/101/)).toBeInTheDocument();
                    expect(screen.getByText(/102/)).toBeInTheDocument();
                    expect(screen.getByText(/103/)).toBeInTheDocument();
                    expect(screen.getByText(/104/)).toBeInTheDocument();
                    expect(screen.getByText(/105/)).toBeInTheDocument();
                    expect(screen.getByText(/106/)).toBeInTheDocument();
                })
            })
        })
    })
});