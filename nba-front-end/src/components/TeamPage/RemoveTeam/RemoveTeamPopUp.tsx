import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { Alert, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Checkbox } from '@mui/material';
import api from '../../../services/api';
import { bake_cookie } from 'sfcookies';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useAuth0 } from '@auth0/auth0-react';

const PopUpAlert = React.forwardRef<HTMLDivElement, AlertProps>(function PopUpAlert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function RemoveTeamPopUp(props: any) {
  
  
  interface ITeam {
    TeamID?: number;
    TeamName?: string;
  }
  const [open, setOpen] = React.useState(false);

  // used for remove team don't ask again checkbox
  const [IsCookieEnabled, setIsCookieEnabled] = useState(false)

  const handleDontAskAgainCheckbox = () => {
    setIsCookieEnabled(prev => !prev)    
  }
  const openAddTeamSnackBar = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const { getAccessTokenSilently } = useAuth0();

  const [teamObject, setTeamObject] = React.useState<ITeam>({TeamID:0,TeamName:""});
  
  useEffect(() => {
    setTeamObject(props.teamList.find((team: any) => team.TeamID === props.teamId[0]))    
  }, [props.teamList, props.teamId, teamObject])

  const [IsError, setIsError] = React.useState(false);   
  const closeRemoveTeamPopup = () => {
    props.setOpenRemoveTeamPopUp(false);
    setIsError(false)
     }

  
  const handleClickConfirmRemoveTeam = async () => {
    //sets cookie if checkbox is clicked on confirm
    if (IsCookieEnabled)
    {      
      bake_cookie('removeTeamDontAskAgain', "1");
    }

    const token = await getAccessTokenSilently();
    
    //removes selected team
    const res:any = await api.RemoveTeam(token, props.teamId)
    .catch((err) => {
      setIsError(true)
    })
     
    if(res) 
    props.setOpenRemoveTeamPopUp(false);
    openAddTeamSnackBar();
    props.setSelectionModel([]);
    props.tableIsUpdated();
    
    

    //props.teamList.find(team => team)
    

  }
    return(
      <> 
        <Dialog id="RemoveTeam" open={props.openRemoveTeamPopUp} disableScrollLock={true}>
              {/* todo: need to add reference to team name */}
              <DialogTitle>Remove {}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  You'll lose all data relating to {props.SelectedTeam?.TeamName}.

                  Are you sure you want to permanently delete this team?
          </DialogContentText>
          {IsError && <Alert severity="error">We are sorry the API is currently down</Alert>}
              </DialogContent>
              <DialogActions >
              <FormControlLabel control={<Checkbox />} id="checkbox" onChange={ e => handleDontAskAgainCheckbox() } style={{marginRight: "45%"}} label="Don't ask again" /> 
                <Button onClick={closeRemoveTeamPopup} style={{ color: "red" }}>Cancel</Button>
                <Button onClick={handleClickConfirmRemoveTeam}>Continue </Button>
              </DialogActions>
        </Dialog>

        <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={open} autoHideDuration={1050} onClose={handleClose}>
        <PopUpAlert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
          Team Successfully Removed!
        </PopUpAlert>
        </Snackbar>
        </Stack>
      </>
    )
  
}