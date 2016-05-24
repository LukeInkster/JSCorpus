function WeightedUndirectedGraphTracer(module) {
    if (WeightedDirectedGraphTracer.call(this, module || WeightedUndirectedGraphTracer)) {
        WeightedUndirectedGraphTracer.prototype.init.call(this);
        return true;
    }
    return false;
}

WeightedUndirectedGraphTracer.prototype = $.extend(true, Object.create(WeightedDirectedGraphTracer.prototype), {
    constructor: WeightedUndirectedGraphTracer,
    init: function () {
        var tracer = this;

        s.settings({
            defaultEdgeType: 'def'
        });
        sigma.canvas.edges.def = function (edge, source, target, context, settings) {
            var color = tracer.getColor(edge, source, target, settings);
            tracer.drawEdge(edge, source, target, color, context, settings);
            tracer.drawEdgeWeight(edge, source, target, color, context, settings);
        };
    },
    _setData: function (G) {
        if (Tracer.prototype._setData.call(this, arguments)) return true;

        graph.clear();
        var nodes = [];
        var edges = [];
        var unitAngle = 2 * Math.PI / G.length;
        var currentAngle = 0;
        for (var i = 0; i < G.length; i++) {
            currentAngle += unitAngle;
            nodes.push({
                id: this.n(i),
                label: '' + i,
                x: .5 + Math.sin(currentAngle) / 2,
                y: .5 + Math.cos(currentAngle) / 2,
                size: 1,
                color: this.color.default,
                weight: 0
            });
        }
        for (var i = 0; i < G.length; i++) {
            for (var j = 0; j <= i; j++) {
                if (G[i][j] || G[j][i]) {
                    edges.push({
                        id: this.e(i, j),
                        source: this.n(i),
                        target: this.n(j),
                        color: this.color.default,
                        size: 1,
                        weight: G[i][j]
                    });
                }
            }
        }

        graph.read({
            nodes: nodes,
            edges: edges
        });
        s.camera.goTo({
            x: 0,
            y: 0,
            angle: 0,
            ratio: 1
        });
        this.refresh();

        return false;
    },
    e: UndirectedGraphTracer.prototype.e,
    drawOnHover: UndirectedGraphTracer.prototype.drawOnHover,
    drawEdge: UndirectedGraphTracer.prototype.drawEdge,
    drawEdgeWeight: function (edge, source, target, color, context, settings) {
        var prefix = settings('prefix') || '';
        if (source[prefix + 'x'] > target[prefix + 'x']) {
            var temp = source;
            source = target;
            target = temp;
        }
        console.log(source);
        console.log(target);
        WeightedDirectedGraphTracer.prototype.drawEdgeWeight.call(this, edge, source, target, color, context, settings);
    }
});

var WeightedUndirectedGraph = {
    random: function (N, ratio, min, max) {
        if (!N) N = 5;
        if (!ratio) ratio = .3;
        if (!min) min = 1;
        if (!max) max = 5;
        var G = new Array(N);
        for (var i = 0; i < N; i++) G[i] = new Array(N);
        for (var i = 0; i < N; i++) {
            for (var j = 0; j < N; j++) {
                if (i > j && (Math.random() * (1 / ratio) | 0) == 0) {
                    G[i][j] = G[j][i] = (Math.random() * (max - min + 1) | 0) + min;
                }
            }
        }
        return G;
    }
};