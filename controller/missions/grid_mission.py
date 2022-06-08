import numpy as np
import itertools

class GridMission():

    def __init__(self, fence, home, orientation, n):
        self.grid_mission(fence, orientation, n)
        self.home = home

    def split_line(self,fence,edge,n):
        a = fence[edge]
        b = fence[(1+edge)%4]


        m= (b[1]-a[1])/(b[0]-a[0])


        x_points = []
        x_points.append(a[0])
        offset = (b[0]-a[0])/n
        for i in range(n):
            x_points.append(round(x_points[i]+offset,13))

        def eqn(x,m,p):
            return m*(x-p[0])+p[1]

        y_points = [round((eqn(x,m,fence[edge])),13) for x in x_points ]

        mid_coordinates = tuple(zip(x_points, y_points)) 

        return list(mid_coordinates)

    def grid_mission(self, fence, orientation, n):

        edges = []
        if orientation == "vertical":
            edges.append(0)
            edges.append(2)
        elif orientation == "horizontal":
            edges.append(1)
            edges.append(3)

        edge1 = self.split_line(fence=fence,edge=edges[0],n=n)
        edge2 = self.split_line(fence=fence,edge=edges[1],n=n)

        edge1 = np.array(edge1).reshape((n+1),2)
        edge2 = np.array(edge2).reshape((n+1),2)
        edge2 = np.flip(edge2,0)
        res = np.array([x for x in itertools.chain.from_iterable(itertools.zip_longest(edge1, edge2)) if x is not None])
        res.flatten()

        self.result = res
        return res

    def export(self, fname):
        with open(fname, 'w') as f:
            f.write("QGC WPL 110\n")
            f.write(f"0	1	0	16	0	0	0	0	{self.home[0]}  {self.home[1]}	100.000000	1\n")
            for i,tup in enumerate(self.result):
                f.write(f"{i+1}	0	3	16	0.00000000	0.00000000	0.00000000	0.00000000	{tup[0]}  {tup[1]}	100.000000	1\n")

        f.close()


fence = [
(35.2465172031294, 33.0282678455114),#bot_left
(35.2466111206525, 33.0283298715949),#top_left
(35.2465089887636, 33.0285712704062),#top_right
(35.2464167139972, 33.0285132676363)]#bot_right
home = (35.2465186,	33.0282699)

gm = GridMission(fence,home,"vertical",7)
gm.export("asd.waypoints")