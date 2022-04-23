import React from 'react';
import { render, screen } from '@testing-library/react';
import { SchedulingColumn } from '../../../Components/Scheduling/SchedulingColumn';
import BlockFormer from '../../../modules/BlockFormer'
import { SchedulingBlock } from '../../../Components/Scheduling/SchedulingBlock';
import { CourseBlock } from '../../../modules/API';
import { APINoAsync } from '../../../modules/__mocks__/API';

jest.mock('../../../Components/Scheduling/SchedulingBlock');

const builder = (department: string, course_number: number, section_number: string, section_id: number, start_time: Date, end_time: Date, weekday: string, place: string,
    scheduled: number[] | null): CourseBlock => {
    return { department, course_number, section_number, section_id, start_time, end_time, weekday, place, scheduled, professor: "", capacity_peer_teachers: 1}
}

describe('SchedulingColumn', () => {
    it('exists', () => {
        render(< SchedulingColumn renderBlockType={SchedulingBlock} day={'Mon'} filter={new Map([[121, true]])} blocks={[
            builder('CSCE', 121, '101', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, 'none', 'nowhere', null)
        ]} />);
    });
    
    describe('display (renderHelper.tsx)', () => {
        describe('single elements', () => {
            it('short element', () => {
                render(< SchedulingColumn renderBlockType={SchedulingBlock} day={'Mon'} filter={new Map([[121, true]])} blocks={[
                    builder('CSCE', 121, '101', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, 'none', 'nowhere', null)
                ]}/>)
                
                const element = screen.getByText(/101/);
                expect(element).toBeInTheDocument();
            });
            
            it('medium element', () => {
                render(< SchedulingColumn renderBlockType={SchedulingBlock} day={'Mon'} filter={new Map([[121, true]])} blocks={[
                    builder('CSCE', 121, '101', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_long, 'none', 'nowhere', null)
                ]}/>)
                
                const element = screen.getByText(/101/);
                expect(element).toBeInTheDocument();
            });
            
            it('long element', () => {
                render(< SchedulingColumn renderBlockType={SchedulingBlock} day={'Mon'} filter={new Map([[121, true]])} blocks={[
                    builder('CSCE', 121, '101', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, 'none', 'nowhere', null)
                ]}/>)
                
                const element = screen.getByText(/101/);
                expect(element).toBeInTheDocument();
            });
        });

        describe('multiple elements', () => {
            describe('Same starting time', () => {
                describe('Same Size', () => {
                    it('displays small elements', () => {
                        render(< SchedulingColumn renderBlockType={SchedulingBlock} day={'Mon'} filter={new Map([[121, true]])} blocks={[
                            builder('CSCE', 121, '101', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, 'none', 'nowhere', null),
                            builder('CSCE', 121, '102', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, 'none', 'nowhere', null),
                            builder('CSCE', 121, '103', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, 'none', 'nowhere', null),
                        ]}/>)
        
                        expect(screen.getByText(/101/)).toBeInTheDocument();
                        expect(screen.getByText(/102/)).toBeInTheDocument();
                        expect(screen.getByText(/103/)).toBeInTheDocument();
                    });
    
                    it('displays medium elements', () => {
                        render(< SchedulingColumn renderBlockType={SchedulingBlock} day={'Mon'} filter={new Map([[121, true]])} blocks={[
                            builder('CSCE', 121, '101', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_long, 'none', 'nowhere', null),
                            builder('CSCE', 121, '102', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_long, 'none', 'nowhere', null),
                            builder('CSCE', 121, '103', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_long, 'none', 'nowhere', null),
                        ]}/>)
        
                        expect(screen.getByText(/101/)).toBeInTheDocument();
                        expect(screen.getByText(/102/)).toBeInTheDocument();
                        expect(screen.getByText(/103/)).toBeInTheDocument();
                    });
    
                    it('displays large elements', () => {
                        render(< SchedulingColumn renderBlockType={SchedulingBlock} day={'Mon'} filter={new Map([[121, true]])} blocks={[
                            builder('CSCE', 121, '101', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, 'none', 'nowhere', null),
                            builder('CSCE', 121, '102', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, 'none', 'nowhere', null),
                            builder('CSCE', 121, '103', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, 'none', 'nowhere', null),
                        ]}/>)
                        
                        expect(screen.getByText(/101/)).toBeInTheDocument();
                        expect(screen.getByText(/102/)).toBeInTheDocument();
                        expect(screen.getByText(/103/)).toBeInTheDocument();
                    });
    
                });
        
                describe('2 Different Sizes', () => {
                    it('displays small and medium elements', () => {
                        render(< SchedulingColumn renderBlockType={SchedulingBlock} day={'Mon'} filter={new Map([[121, true]])} blocks={[
                            builder('CSCE', 121, '101', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, 'none', 'nowhere', null),
                            builder('CSCE', 121, '102', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_long, 'none', 'nowhere', null),
                            builder('CSCE', 121, '103', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_long, 'none', 'nowhere', null),
                            builder('CSCE', 121, '104', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, 'none', 'nowhere', null),
                            builder('CSCE', 121, '105', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, 'none', 'nowhere', null),
                        ]}/>)
                        
                        expect(screen.getByText(/101/)).toBeInTheDocument();
                        expect(screen.getByText(/102/)).toBeInTheDocument();
                        expect(screen.getByText(/103/)).toBeInTheDocument();
                        expect(screen.getByText(/104/)).toBeInTheDocument();
                        expect(screen.getByText(/105/)).toBeInTheDocument();
                    });
    
                    it('displays small and large elements', () => {
                        render(< SchedulingColumn renderBlockType={SchedulingBlock} day={'Mon'} filter={new Map([[121, true]])} blocks={[
                            builder('CSCE', 121, '101', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, 'none', 'nowhere', null),
                            builder('CSCE', 121, '102', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, 'none', 'nowhere', null),
                            builder('CSCE', 121, '103', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, 'none', 'nowhere', null),
                            builder('CSCE', 121, '104', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, 'none', 'nowhere', null),
                            builder('CSCE', 121, '105', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, 'none', 'nowhere', null),
                        ]}/>)
        
                        expect(screen.getByText(/101/)).toBeInTheDocument();
                        expect(screen.getByText(/102/)).toBeInTheDocument();
                        expect(screen.getByText(/103/)).toBeInTheDocument();
                        expect(screen.getByText(/104/)).toBeInTheDocument();
                        expect(screen.getByText(/105/)).toBeInTheDocument();
                    });
    
                    it('displays medium and large elements', () => {
                        render(< SchedulingColumn renderBlockType={SchedulingBlock} day={'Mon'} filter={new Map([[121, true]])} blocks={[
                            builder('CSCE', 121, '101', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_long, 'none', 'nowhere', null),
                            builder('CSCE', 121, '102', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_long, 'none', 'nowhere', null),
                            builder('CSCE', 121, '103', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, 'none', 'nowhere', null),
                            builder('CSCE', 121, '104', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, 'none', 'nowhere', null),
                            builder('CSCE', 121, '105', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_long, 'none', 'nowhere', null),
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
                        render(< SchedulingColumn renderBlockType={SchedulingBlock} day={'Mon'} filter={new Map([[121, true]])} blocks={[
                            builder('CSCE', 121, '101', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, 'none', 'nowhere', null),
                            builder('CSCE', 121, '104', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_short, 'none', 'nowhere', null),
                            builder('CSCE', 121, '102', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, 'none', 'nowhere', null),
                            builder('CSCE', 121, '105', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_short, 'none', 'nowhere', null),
                            builder('CSCE', 121, '103', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, 'none', 'nowhere', null),
                            builder('CSCE', 121, '106', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_short, 'none', 'nowhere', null),
                        ]}/>)
        
                        expect(screen.getByText(/101/)).toBeInTheDocument();
                        expect(screen.getByText(/102/)).toBeInTheDocument();
                        expect(screen.getByText(/103/)).toBeInTheDocument();
                        expect(screen.getByText(/104/)).toBeInTheDocument();
                        expect(screen.getByText(/105/)).toBeInTheDocument();
                        expect(screen.getByText(/106/)).toBeInTheDocument();
                    });
    
                    it('displays medium elements', () => {
                        render(< SchedulingColumn renderBlockType={SchedulingBlock} day={'Mon'} filter={new Map([[121, true]])} blocks={[
                            builder('CSCE', 121, '101', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_long, 'none', 'nowhere', null),
                            builder('CSCE', 121, '104', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_long, 'none', 'nowhere', null),
                            builder('CSCE', 121, '102', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_long, 'none', 'nowhere', null),
                            builder('CSCE', 121, '105', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_long, 'none', 'nowhere', null),
                            builder('CSCE', 121, '103', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_long, 'none', 'nowhere', null),
                            builder('CSCE', 121, '106', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_long, 'none', 'nowhere', null),
                        ]}/>)
        
                        expect(screen.getByText(/101/)).toBeInTheDocument();
                        expect(screen.getByText(/102/)).toBeInTheDocument();
                        expect(screen.getByText(/103/)).toBeInTheDocument();
                        expect(screen.getByText(/104/)).toBeInTheDocument();
                        expect(screen.getByText(/105/)).toBeInTheDocument();
                        expect(screen.getByText(/106/)).toBeInTheDocument();
                    });
    
                    it('displays large elements', () => {
                        render(< SchedulingColumn renderBlockType={SchedulingBlock} day={'Mon'} filter={new Map([[121, true]])} blocks={[
                            builder('CSCE', 121, '101', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, 'none', 'nowhere', null),
                            builder('CSCE', 121, '104', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_extralong, 'none', 'nowhere', null),
                            builder('CSCE', 121, '102', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, 'none', 'nowhere', null),
                            builder('CSCE', 121, '105', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_extralong, 'none', 'nowhere', null),
                            builder('CSCE', 121, '103', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, 'none', 'nowhere', null),
                            builder('CSCE', 121, '106', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_extralong, 'none', 'nowhere', null),
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
                        render(< SchedulingColumn renderBlockType={SchedulingBlock} day={'Mon'} filter={new Map([[121, true]])} blocks={[
                            builder('CSCE', 121, '101', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, 'none', 'nowhere', null),
                            builder('CSCE', 121, '104', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_short, 'none', 'nowhere', null),
                            builder('CSCE', 121, '102', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, 'none', 'nowhere', null),
                            builder('CSCE', 121, '105', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_short, 'none', 'nowhere', null),
                            builder('CSCE', 121, '103', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, 'none', 'nowhere', null),
                            builder('CSCE', 121, '106', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_short, 'none', 'nowhere', null),
                            builder('CSCE', 121, '107', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_long, 'none', 'nowhere', null),
                            builder('CSCE', 121, '108', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_long, 'none', 'nowhere', null),
                            builder('CSCE', 121, '109', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_long, 'none', 'nowhere', null),
                            builder('CSCE', 121, '110', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_long, 'none', 'nowhere', null),
                            builder('CSCE', 121, '111', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_long, 'none', 'nowhere', null),
                            builder('CSCE', 121, '112', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_long, 'none', 'nowhere', null),
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
                        render(< SchedulingColumn renderBlockType={SchedulingBlock} day={'Mon'} filter={new Map([[121, true]])} blocks={[
                            builder('CSCE', 121, '101', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, 'none', 'nowhere', null),
                            builder('CSCE', 121, '104', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_short, 'none', 'nowhere', null),
                            builder('CSCE', 121, '102', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, 'none', 'nowhere', null),
                            builder('CSCE', 121, '105', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_short, 'none', 'nowhere', null),
                            builder('CSCE', 121, '103', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, 'none', 'nowhere', null),
                            builder('CSCE', 121, '106', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_short, 'none', 'nowhere', null),
                            builder('CSCE', 121, '107', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, 'none', 'nowhere', null),
                            builder('CSCE', 121, '108', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_extralong, 'none', 'nowhere', null),
                            builder('CSCE', 121, '109', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, 'none', 'nowhere', null),
                            builder('CSCE', 121, '110', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_extralong, 'none', 'nowhere', null),
                            builder('CSCE', 121, '111', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, 'none', 'nowhere', null),
                            builder('CSCE', 121, '112', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_extralong, 'none', 'nowhere', null),
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
                        render(< SchedulingColumn renderBlockType={SchedulingBlock} day={'Mon'} filter={new Map([[121, true]])} blocks={[
                            builder('CSCE', 121, '101', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, 'none', 'nowhere', null),
                            builder('CSCE', 121, '104', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_extralong, 'none', 'nowhere', null),
                            builder('CSCE', 121, '102', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, 'none', 'nowhere', null),
                            builder('CSCE', 121, '105', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_extralong, 'none', 'nowhere', null),
                            builder('CSCE', 121, '103', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, 'none', 'nowhere', null),
                            builder('CSCE', 121, '106', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_extralong, 'none', 'nowhere', null),
                            builder('CSCE', 121, '107', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_long, 'none', 'nowhere', null),
                            builder('CSCE', 121, '108', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_long, 'none', 'nowhere', null),
                            builder('CSCE', 121, '109', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_long, 'none', 'nowhere', null),
                            builder('CSCE', 121, '110', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_long, 'none', 'nowhere', null),
                            builder('CSCE', 121, '111', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_long, 'none', 'nowhere', null),
                            builder('CSCE', 121, '112', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_long, 'none', 'nowhere', null),
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
                        render(< SchedulingColumn renderBlockType={SchedulingBlock} day={'Mon'} filter={new Map([[121, true]])} blocks={[
                            builder('CSCE', 121, '101', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, 'none', 'nowhere', null),
                            builder('CSCE', 121, '102', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_long, 'none', 'nowhere', null),
                            
                            builder('CSCE', 121, '103', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_short, 'none', 'nowhere', null),
                            builder('CSCE', 121, '104', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_extralong, 'none', 'nowhere', null),
    
                            builder('CSCE', 121, '105', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_long, 'none', 'nowhere', null),
                            builder('CSCE', 121, '106', 1, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_extralong, 'none', 'nowhere', null),
                        ]}/>)
                        
                        expect(screen.getByText(/101/)).toBeInTheDocument();
                        expect(screen.getByText(/102/)).toBeInTheDocument();
                        expect(screen.getByText(/103/)).toBeInTheDocument();
                        expect(screen.getByText(/104/)).toBeInTheDocument();
                        expect(screen.getByText(/105/)).toBeInTheDocument();
                        expect(screen.getByText(/106/)).toBeInTheDocument();
                    })
                })

                it('displays many blocks', () => {
                    const blocks = APINoAsync.fetchCourseBlocks();
                    render(< SchedulingColumn renderBlockType={SchedulingBlock} day={'Mon'} filter={new Map([[121, true]])} blocks={blocks.Monday} />);
                    blocks.Monday!.forEach(b => {
                        expect(screen.getByTestId(b.section_id)).toBeInTheDocument();
                    })
                })
            })
        });

        describe('special cases', () => {
            it('says there is nothing to show when there are no blocks', () => {
                render(< SchedulingColumn renderBlockType={SchedulingBlock} day={'Mon'} filter={new Map([[121, true]])} blocks={[]} />);
                expect(screen.getByText(/nothing/i)).toBeInTheDocument();
            })

            it('says there was an error when one occurs', () => {
                render(< SchedulingColumn renderBlockType={SchedulingBlock} day={'Mon'} filter={new Map([[121, true]])} blocks={[
                    builder('CSCE', -1, '101', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, 'none', 'nowhere', null)
                ]} />);
                expect(screen.getByText(/error/i)).toBeInTheDocument();
            })
        })
    })

    describe("functionality", () => {
        describe("detail view", () => {
            it("becomes detailed when clicked", () => {
                render(< SchedulingColumn renderBlockType={SchedulingBlock} day={'Mon'} filter={new Map([[121, true]])} blocks={[]} />);
                
                const header = screen.getByText("Mon");
                header.click();
                expect(header).toHaveClass("detailed");
            });

            it("has a back button", () => {
                render(< SchedulingColumn renderBlockType={SchedulingBlock} day={'Mon'} filter={new Map([[121, true]])} blocks={[]} />);

                const header = screen.getByText("Mon");
                header.click();
                expect(screen.getByText(/back/i)).toBeInTheDocument();
            });

            it("becomes undetailed when the back button is pressed", () => {
                render(< SchedulingColumn renderBlockType={SchedulingBlock} day={'Mon'} filter={new Map([[121, true]])} blocks={[]} />);

                const header = screen.getByText("Mon");
                header.click();
                expect(header).toHaveClass("detailed");

                const backButton = screen.getByText(/back/i);
                backButton.click();
                expect(header).not.toHaveClass("detailed");
            });

            it('has a button to hide the labels', () => {
                render(< SchedulingColumn renderBlockType={SchedulingBlock} day={'Mon'} filter={new Map([[121, true]])} blocks={[
                    builder('CSCE', 121, '101', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, 'none', 'nowhere', [1])
                ]} />);

                const header = screen.getByText("Mon");
                header.click();
                expect(screen.getByText(/hide/i)).toBeInTheDocument();
            });

            it('hides the labels when the hide button is pressed', () => {
                render(
                    <>
                        <div className="hat-container" data-testid="hat-container"/>
                        < SchedulingColumn renderBlockType={SchedulingBlock} day={'Mon'} filter={new Map([[121, true]])} blocks={[
                            builder('CSCE', 121, '101', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, 'none', 'nowhere', [1])
                        ]} />
                    </>
                );

                const header = screen.getByText("Mon");
                header.click();
                expect(header).toHaveClass("detailed");

                const hatContainer = screen.getByTestId("hat-container");
                expect(hatContainer).not.toHaveClass('shrunk');
                
                const hideButton = screen.getByText(/hide/i);
                hideButton.click();
                expect(hatContainer).toHaveClass('shrunk');
            });

            it('shows the labels when the hide button is pressed twice', () => {
                render(
                    <>
                        <div className="hat-container" data-testid="hat-container"/>
                        < SchedulingColumn renderBlockType={SchedulingBlock} day={'Mon'} filter={new Map([[121, true]])} blocks={[
                            builder('CSCE', 121, '101', 1, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, 'none', 'nowhere', [1])
                        ]} />
                    </>
                );

                const header = screen.getByText("Mon");
                header.click();
                expect(header).toHaveClass("detailed");

                const hatContainer = screen.getByTestId("hat-container");
                expect(hatContainer).not.toHaveClass('shrunk');
                
                const hideButton = screen.getByText(/hide/i);
                hideButton.click();
                expect(hatContainer).toHaveClass('shrunk');

                hideButton.click();
                expect(hatContainer).not.toHaveClass('shrunk');
            });
        })
    })
});