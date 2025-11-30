import { Lightbulb, LightbulbOutline } from "@mui/icons-material"
import { Alert, Box, Stack, Typography, IconButton } from "@mui/material"
import { useState } from "react"

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
    <Box
      sx={(theme) => ({
        borderRadius: theme.box.borderRadius,
        bgcolor: theme.box.bgColor,
        p: 2,
        border: `2px solid ${theme.box.borderColor}`
      })}
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
                <Lightbulb sx={(theme) => ({ fontSize: 60, color: theme.palette.text.primary, border: `2px solid ${theme.palette.text.primary}`, borderRadius: '100%', p: 1 })} />

              ) : (
                <LightbulbOutline sx={(theme) => ({ fontSize: 60, color: theme.palette.text.primary, border: `2px solid ${theme.palette.text.primary}`, borderRadius: '100%', p: 1 })} />
              )
          }
        </IconButton>
      </Stack>

      <Alert severity="warning">
        Oświetlenie zmieni swój stan zgodnie z harmonogramem.
      </Alert>

    </Box>
  )
}

export default ManualControl