export type RequestData = {
    car_distance: number;
    angle: number;
    cube_distance: number;
    time: string;
};

type GraphData = {
    label: string;
    data: number[];
    color: string;
};

type Scales = {
    min?: number;
    max?: number;
    suggestedMax?: number;
};

export type CreateGraphData = {
    title: string;
    data: GraphData[];
    scales?: Scales;
};
