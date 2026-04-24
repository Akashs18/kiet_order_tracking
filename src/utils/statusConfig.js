const TRADING_STEPS = [
    'PENDING',
    'ORDERED',
    'RECEIVED',
    'INVOICED',
    'DISPATCHED',
    'DELIVERED'
];

const MACHINERY_STEPS = [
    'purchase order',
    'kick off meeting',
    'prelimnary design review',
    'critical design review',
    'production launch',
    'BOM release[mechanical]',
    'BOM release[electrical]',
    'procurement',
    'production completion',
    'inward inspection[mechanical]',
    'inward inspection[electrical]',
    'assembly and integration',
    'wireing and routing',
    'instrumentation and programming',
    'functional check',
    'quality check',
    'invoice delivery',
    'commisioning and installation',
    'project closure'
];

const ORDER_TYPES = {
    TRADING: {
        label: 'Trading',
        steps: TRADING_STEPS
    },
    MACHINERY: {
        label: 'Machinery',
        steps: MACHINERY_STEPS
    }
};

module.exports = {
    TRADING_STEPS,
    MACHINERY_STEPS,
    ORDER_TYPES,
    getSteps: (type) => (ORDER_TYPES[type] || ORDER_TYPES.TRADING).steps
};
