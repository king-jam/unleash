import { Button, Typography, styled } from '@mui/material';
import { DemoDialog } from '../DemoDialog';
import { GitHub } from '@mui/icons-material';
import { Launch } from '@mui/icons-material';
import { usePlausibleTracker } from 'hooks/usePlausibleTracker';

const StyledDemoDialog = styled(DemoDialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        maxWidth: theme.spacing(120),
    },
}));

const StyledPlans = styled('div')(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'auto auto auto',
    gap: theme.spacing(1),
    marginTop: theme.spacing(6),
}));

const StyledPlan = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.background.elevation1,
    borderRadius: theme.shape.borderRadiusLarge,
    padding: theme.spacing(4, 3),
    '& > a': {
        whiteSpace: 'nowrap',
    },
    height: theme.spacing(34),
    width: theme.spacing(34),
}));

const StyledCompareLink = styled('a')(({ theme }) => ({
    fontSize: theme.fontSizes.mainHeader,
    textDecoration: 'none',
    '&:hover': {
        textDecoration: 'underline',
    },
    margin: 'auto',
    marginTop: theme.spacing(4),
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    '& > svg': {
        fontSize: theme.fontSizes.mainHeader,
    },
}));

interface IDemoDialogPlansProps {
    open: boolean;
    onClose: () => void;
}

export const DemoDialogPlans = ({ open, onClose }: IDemoDialogPlansProps) => {
    const { trackEvent } = usePlausibleTracker();

    return (
        <StyledDemoDialog open={open} onClose={onClose}>
            <DemoDialog.Header>
                Want to keep going with Unleash?
            </DemoDialog.Header>
            <StyledPlans>
                <StyledPlan>
                    <Typography variant="h5" fontWeight="bold">
                        Open Source
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Self-hosted basic feature management solution
                    </Typography>
                    <Typography variant="h6" fontWeight="normal">
                        Free
                    </Typography>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<GitHub />}
                        href="https://github.com/unleash/unleash"
                        target="_blank"
                        onClick={() => {
                            trackEvent('demo', {
                                props: {
                                    eventType: 'see_plan',
                                    plan: 'open_source',
                                },
                            });
                        }}
                    >
                        View project on GitHub
                    </Button>
                </StyledPlan>
                <StyledPlan>
                    <Typography variant="h5" fontWeight="bold">
                        Pro
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Free your team to collaborate. We'll do the heavy
                        lifting.
                    </Typography>
                    <div>
                        <Typography variant="h6" fontWeight="normal">
                            $80/month
                        </Typography>
                        <Typography variant="body2">
                            includes 5 seats
                        </Typography>
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        href="https://www.getunleash.io/plans/pro"
                        target="_blank"
                        onClick={() => {
                            trackEvent('demo', {
                                props: {
                                    eventType: 'see_plan',
                                    plan: 'pro',
                                },
                            });
                        }}
                    >
                        Start 14-day free trial
                    </Button>
                </StyledPlan>
                <StyledPlan>
                    <Typography variant="h5" fontWeight="bold">
                        Enterprise
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Security, compliance, and development controls for
                        scale.
                    </Typography>
                    <div>
                        <Typography variant="h6" fontWeight="normal">
                            Custom
                        </Typography>
                        <Typography variant="body2">unlimited seats</Typography>
                    </div>
                    <Button
                        variant="contained"
                        color="web"
                        href="https://www.getunleash.io/plans/enterprise"
                        target="_blank"
                        onClick={() => {
                            trackEvent('demo', {
                                props: {
                                    eventType: 'see_plan',
                                    plan: 'enterprise',
                                },
                            });
                        }}
                    >
                        Contact sales
                    </Button>
                </StyledPlan>
            </StyledPlans>
            <StyledCompareLink
                href="https://www.getunleash.io/plans"
                target="_blank"
                onClick={() => {
                    trackEvent('demo', {
                        props: {
                            eventType: 'see_plan',
                            plan: 'compare_plans',
                        },
                    });
                }}
            >
                Compare plans <Launch />
            </StyledCompareLink>
        </StyledDemoDialog>
    );
};
