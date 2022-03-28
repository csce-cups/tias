import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { Dot } from '../../../Components/Misc/Dot';


describe('Dot', () => {
    const subjectID = 0;

    const generateDots = (count: number, similar: boolean) => {
        for (let i = 0; i < count; i++) render(< Dot isScheduled={true} linkID={subjectID + (similar? 0 : i+1)} />);
    }

    describe('hover', () => {
        it('emphasizes dots with the same link ID', () => {
            render(< Dot isScheduled={true} linkID={subjectID}/>);

            generateDots(2, true);
    
            const dots = screen.getAllByTestId('dot');
    
            userEvent.hover(dots[0]);
            dots.forEach(e => {
                expect(e.className.split(' ').includes('emphasized')).toEqual(true);
            });
    
            userEvent.unhover(dots[0]);
            dots.forEach(e => {
                expect(e.className.split(' ').includes('emphasized')).toEqual(false);
            });
        });
    
        it('doesn\'t emphasize dots with a different link ID', () => {
            render(< Dot isScheduled={true} linkID={subjectID}/>);

            generateDots(2, false);
    
            const dots = screen.getAllByTestId('dot');
    
            userEvent.hover(dots[0]);
            dots.filter(e => !(e.getAttribute('link-id') === subjectID.toString())).forEach(e => {
                expect(e.className.split(' ').includes('emphasized')).toEqual(false);
            });
        });
    
        it('deemphasizes dots with a different link ID', () => {
            render(< Dot isScheduled={true} linkID={subjectID}/>);

            generateDots(2, false);
    
            const dots = screen.getAllByTestId('dot');
    
            userEvent.hover(dots[0]);
            dots.filter(e => !(e.getAttribute('link-id') === subjectID.toString())).forEach(e => {
                expect(e.className.split(' ').includes('deemphasized')).toEqual(true);
            });
    
            userEvent.unhover(dots[0]);
            dots.filter(e => !(e.getAttribute('link-id') === subjectID.toString())).forEach(e => {
                expect(e.className.split(' ').includes('deemphasized')).toEqual(false);
            });
        });
    
        it('doesn\'t deemphasize dots with the same link ID', () => {
            render(< Dot isScheduled={true} linkID={subjectID}/>);

            generateDots(2, true);
    
            const dots = screen.getAllByTestId('dot');
    
            userEvent.hover(dots[0]);
            dots.forEach(e => {
                expect(e.className.split(' ').includes('deemphasized')).toEqual(false);
            });
        });
    });

    describe('click', () => {
        it('selects dots with the same link ID', () => {
            render(< Dot isScheduled={true} linkID={subjectID}/>);

            generateDots(2, true);
    
            const dots = screen.getAllByTestId('dot');
    
            userEvent.click(dots[0]);
            dots.forEach(e => {
                expect(e.className.split(' ').includes('selected')).toEqual(true);
            });
        });
    
        it('doesn\'t select dots with a different link ID', () => {
            render(< Dot isScheduled={true} linkID={subjectID}/>);

            generateDots(2, false);
    
            const dots = screen.getAllByTestId('dot');
    
            userEvent.click(dots[0]);
            dots.filter(e => !(e.getAttribute('link-id') === subjectID.toString())).forEach(e => {
                expect(e.className.split(' ').includes('selected')).toEqual(false);
            });
        });
    
        it('deselects dots with a different link ID', () => {
            render(< Dot isScheduled={true} linkID={subjectID}/>);

            generateDots(2, false);
    
            const dots = screen.getAllByTestId('dot');
    
            userEvent.click(dots[0]);
            dots.filter(e => !(e.getAttribute('link-id') === subjectID.toString())).forEach(e => {
                expect(e.className.split(' ').includes('deselected')).toEqual(true);
            });
        });
    
        it('doesn\'t deselect dots with the same link ID', () => {
            render(< Dot isScheduled={true} linkID={subjectID}/>);

            generateDots(2, true);
    
            const dots = screen.getAllByTestId('dot');
    
            userEvent.click(dots[0]);
            dots.forEach(e => {
                expect(e.className.split(' ').includes('deselected')).toEqual(false);
            });
        });

        it('is undone by clicking outside (dependent on above)', () => {
            render(< Dot isScheduled={true} linkID={subjectID}/>);

            generateDots(2, true);
            generateDots(2, false);

            const dots = screen.getAllByTestId('dot');

            userEvent.click(dots[0]);
            dots.forEach(e => {
                expect(e.className.split(' ').includes((e.getAttribute('link-id') === subjectID.toString())? 'selected' : 'deselected')).toEqual(true);
            });

            userEvent.click(document.body);

            dots.forEach(e => {
                expect(e.className.split(' ').includes('deselected')).toEqual(false);
                expect(e.className.split(' ').includes('selected')).toEqual(false);
            });
        });
    })
    
});