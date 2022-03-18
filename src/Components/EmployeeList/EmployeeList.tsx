import React, { FC } from 'react'
import { EmployeeRow } from './EmployeeRow'
import { GenerateButton } from './GenerateButton'
import { AcceptButton } from './AcceptButton'
import { APIPerson } from '../../modules/API'

interface Props {
	data: APIPerson[] | string[]
}

function getData(): Array<string> {
	return [
		"Geralt of Rivia",
    "Gary Chess", 
    "Sandy Banks", 
    "King Gerold III",
    "Sharpness IV", 
    "Zelda DeLegendof",
    "Star Fox", 
		"Luigi Smansion", 
    "John Doom", 
    "Spongebob Squarepants",
    "Crash Bandishoot",
    "Suzzie Sunshine",
    "Mr. Generic",
    "Honda Accord",
    "K.K. Slider",
    "Gee Wilikers",
    "Mario Galaxy",
    "Ms. Generic",
    "Bubble Bass",
    "Sandy Cheeks",
    "Patrick",
    "Samus Errands",
    "Timmy Twix",
    "Marvin M&M",
    "Bikeal Roads",
    "Spicy Peppers",
    "Quintin QWERTY",
    "Asmorald ASDF",
    "Timmothy Tingle",
    "Kimmothy Kartz",
    "Zimmothy Zions",
    "Phoenix Wright",
    "Mia Fey",
    "Miles Edgeworth",
    "Maya Fey",
    "Pearl Fey",
    "Dick Gumshoe",
    "Franziska von Karma",
    "Ema Skye",
    "The Judge",
    "Apollo Justice",
    "Trucy Wright",
    "Athena Cykes",
    "Ryunosuke Naruhodo",
    "Susato Mikotoba",
    "Herlock Sholmes",
    "Iris Wilson",
    "Barok van Zieks",
    "Tetsutetsu Tetsutetsu",
    "Bobaboba Bobaboba",
    "Spike the Cowboy",
    "Guard the Reserve",
    "Hero Sandwich"
	];
}

export const EmployeeList: FC<Props> = ({data}) => {
  return (
    <div className="vstack">
      <div className="header">
        <h2 className="slim">Employee</h2>
      </div>

      {(data.length > 0)?
        <div className="scrollable">
          {data.map((e: APIPerson | string, index: number) => (
            (typeof e === 'string')? 
              < EmployeeRow key={index} linkID={index} element={e} />
            : < EmployeeRow key={index} linkID={e.person_id} element={`${e.first_name} ${e.last_name}`} />
          ))}
        </div>

      : <div className="loading">Loading...</div>
      }

      <div className="vstack top-border">
        < GenerateButton />
        < AcceptButton />
      </div>
    </div>
  )
}
