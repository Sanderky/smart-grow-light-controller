import { Box, Divider, Stack, Typography } from "@mui/material";
import { LocalFlorist } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { fetchTime } from "../api/time";


const useServerTime = () => {
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    const {
        data: serverTime
    } = useQuery<Date, Error>({
        queryKey: ['serverTime'],
        queryFn: fetchTime,
        refetchInterval: 1000 * 60
    });

    useEffect(() => {
        if (serverTime) {
            setCurrentTime(serverTime);

            const interval = setInterval(() => {
                setCurrentTime(prevTime => prevTime ? new Date(prevTime.getTime() + 1000) : null);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [serverTime]);

    const dateString = useMemo(() => {
        return currentTime ? currentTime.toLocaleDateString('pl-PL') : null;
    }, [currentTime ? currentTime.toDateString() : null]);
    const timeString = currentTime ? currentTime.toLocaleTimeString('pl-PL') : null;

    return {
        dateString,
        timeString
    }

}

const Info = () => {

    const { dateString, timeString } = useServerTime()

    return (
        <Box
            sx={(theme) => ({
                borderRadius: theme.box.borderRadius,
                bgcolor: theme.box.bgColor,
                p: 2,
                border: `2px solid ${theme.box.borderColor}`
            })}>
            <Box
                sx={{
                    display: 'flex',
                    direction: 'row',
                    columnGap: 1
                }}
            >
                <Typography variant="h1" sx={{ fontSize: '1.5rem' }}>
                    Smart Grow Light Controller
                </Typography>
                <LocalFlorist fontSize="medium" sx={(theme) => ({ color: theme.palette.text.primary, mt: 0.3 })} />
            </Box>
            <Stack
                direction={'column'}
                spacing={1}
                sx={{
                    my: 2
                }}
            >
                <Typography>Status oświetlenia: włączone</Typography>
                <Typography>Harmonogram aktywny</Typography>
                <Typography>Najbiższe wyłączenie za 2 godziny</Typography>
            </Stack>
            <Divider />
            <Stack
                direction={'column'}
                spacing={1}
                sx={{
                    my: 2
                }}
            >
                <Typography>Data serwera: {dateString ?? '- -'}</Typography>
                <Typography>Godzina serwera: {timeString ?? '- -'}</Typography>
            </Stack>
        </Box>
    )
}

export default Info