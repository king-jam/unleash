import { usePageTitle } from 'hooks/usePageTitle';
import { Mermaid } from 'component/common/Mermaid/Mermaid';
import { useInstanceMetrics } from 'hooks/api/getters/useInstanceMetrics/useInstanceMetrics';
import { ConditionallyRender } from 'component/common/ConditionallyRender/ConditionallyRender';
import { Alert, styled } from '@mui/material';
import { unknownify } from 'utils/unknownify';
import { useMemo } from 'react';
import {
    RequestsPerSecondSchema,
    RequestsPerSecondSchemaDataResultItem,
} from 'openapi';
import logoIcon from 'assets/icons/logoBg.svg';
import { formatAssetPath } from 'utils/formatPath';

const StyledMermaid = styled(Mermaid)(({ theme }) => ({
    '#mermaid .node rect': {
        fill: theme.palette.secondary.light,
        stroke: theme.palette.secondary.border,
    },
}));

const isRecent = (value: ResultValue) => {
    const threshold = 600000; // ten minutes
    return value[0] * 1000 > new Date().getTime() - threshold;
};

type ResultValue = [number, string];

interface INetworkApp {
    label: string;
    reqs: number;
    type: string;
}

const asNetworkAppData = (result: RequestsPerSecondSchemaDataResultItem) => {
    const values = (result.values || []) as ResultValue[];
    const data = values.filter(value => isRecent(value));
    const reqs = data.length ? parseFloat(data[data.length - 1][1]) : 0;
    return {
        label: unknownify(result.metric?.appName),
        reqs,
        type: unknownify(result.metric?.endpoint?.split('/')[2]),
    };
};

const summingReqsByLabelAndType = (
    acc: {
        [group: string]: INetworkApp;
    },
    current: INetworkApp
) => {
    const groupBy = current.label + current.type;
    acc[groupBy] = {
        ...current,
        reqs: current.reqs + (acc[groupBy]?.reqs ?? 0),
    };
    return acc;
};

const toGraphData = (metrics?: RequestsPerSecondSchema) => {
    const results =
        metrics?.data?.result?.filter(result => result?.metric?.appName) || [];
    const aggregated = results
        .map(asNetworkAppData)
        .reduce(summingReqsByLabelAndType, {});
    return (
        Object.values(aggregated)
            .map(app => ({ ...app, reqs: app.reqs.toFixed(2) }))
            .filter(app => app.reqs !== '0.00') ?? []
    );
};

export const NetworkOverview = () => {
    usePageTitle('Network - Overview');
    const { metrics } = useInstanceMetrics();
    const apps = useMemo(() => {
        return toGraphData(metrics);
    }, [metrics]);

    const graph = `
    graph TD
        subgraph _[ ]
        direction BT
            Unleash(<img src='${formatAssetPath(
                logoIcon
            )}' width='60' height='60' /><br/>Unleash)
            ${apps
                .map(
                    ({ label, reqs, type }, i) =>
                        `app-${i}(${label}) -- ${reqs} req/s<br>${type} --> Unleash`
                )
                .join('\n')}
        end
    `;

    return (
        <ConditionallyRender
            condition={apps.length === 0}
            show={<Alert severity="warning">No data available.</Alert>}
            elseShow={<StyledMermaid>{graph}</StyledMermaid>}
        />
    );
};

export default NetworkOverview;
