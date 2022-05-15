import { Button, Paper } from '@mui/material'
import './PredictionSectionStyles.css';
import React, { useEffect, useState } from 'react'
import PredictionServices from '../../../services/PredictionServices/PredictionServices';

//todo make models/predictionModels section
import {ITeam} from '../../PredictionPage/PredictionPage'

function PredictionSection(props: any) {

  interface IPredictionResult {
    teams: ITeam[],
    winner: string,
    loser: string,
    edge: string,
    IsDraw: boolean,    
  }

  const [predictionResult, setPredictionResult] = useState<IPredictionResult>({
    teams: [],
    winner: "",
    loser:"",
    edge: "",
    IsDraw:false
  })

  const calculatePrediction = () => {

    if (props.selectedTeams.length === 2) {
      
      const teamMatchUp = PredictionServices.calculatePrediction(props.selectedTeams)

      setPredictionResult(teamMatchUp as IPredictionResult)
    }
    
  }
  useEffect(() => {
    calculatePrediction()
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedTeams])


  const createMatchUpResultHtml = () => {
    
    let winnerColour = predictionResult.winner === predictionResult.teams[0].TeamName ? 'blue' : 'red'
    let loserColour = winnerColour === 'blue' ? 'red':'blue'

    return (
      <>        
        <h1><span className='blue'>{predictionResult.teams[0].TeamName}</span> VS <span className='red'>{predictionResult.teams[1].TeamName}</span></h1>
        <h1><span className={winnerColour}>{predictionResult.winner}</span> has an edge of {predictionResult.edge} against <span className={loserColour}>{predictionResult.loser}</span></h1>
      </>
    )            
  }
  
  
  return (
      <>
          <Paper
              sx={{
                p: 2,
                height: 'auto'                
            }}
            >
        {props.selectedTeams.length !== 2 && <h1>Please Select Two Teams</h1>}  
        {(predictionResult.teams.length === 2 && !predictionResult.IsDraw) && createMatchUpResultHtml()}        
        {(predictionResult.teams.length === 2 && predictionResult.IsDraw) && <h1>{predictionResult.teams[0].TeamName} and {predictionResult.teams[1].TeamName} are evenly matched</h1>}
        <Button
          variant="contained"
          onClick={props.navigateToMatchUps}
        >
          MATCH UPS
        </Button>
          </Paper>
      </>
  )
}

export default PredictionSection