import { Lightbulb, LightbulbOutline } from "@mui/icons-material"
import { Alert, Stack, Typography, IconButton } from "@mui/material"
import { useState } from "react"
import BoxWrapper from "./BoxWrapper"

const useManualControl = () => {

  const [lightStatus, setLightStatus] = useState(false)

  const handleToggleLightStatus = () => {
    setLightStatus(prev => !prev)
  }

  return {
    lightStatus,
    handleToggleLightStatus
  }
}

const ManualControl = () => {
  const { lightStatus, handleToggleLightStatus } = useManualControl()

  return (
    <BoxWrapper
    >
      <Typography variant="h3">Manualne sterowanie</Typography>
      <Stack direction={'row'} justifyContent={'center'}>

        <IconButton onClick={handleToggleLightStatus} sx={{
          mt: 2,
          mb: 2
        }}>
          {
            lightStatus ?
              (
                <Lightbulb sx={(theme) => ({ fontSize: 60, color: theme.palette.primary.main, border: `2px solid ${theme.palette.primary.main}`, borderRadius: '100%', p: 1 })} />

              ) : (
                <LightbulbOutline sx={(theme) => ({ fontSize: 60, color: theme.palette.primary.main, border: `2px solid ${theme.palette.primary.main}`, borderRadius: '100%', p: 1 })} />
              )
          }
        </IconButton>
      </Stack>

      <Alert severity="warning">
        Oświetlenie zmieni swój stan zgodnie z harmonogramem.
      </Alert>

    </BoxWrapper>
  )
}

export default ManualControl