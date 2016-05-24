var tracer = new WeightedDirectedGraphTracer();
/*var G = [ // G[i][j] indicates the weight of the path from the i-th node to the j-th node
 [0, 3, 0, 1, 0],
 [5, 0, 1, 2, 4],
 [1, 0, 0, 2, 0],
 [0, 2, 0, 0, 1],
 [0, 1, 3, 0, 0]
 ];*/
var G = WeightedDirectedGraph.random(5, .5);
tracer._setData(G);