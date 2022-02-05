The application not works weel.
In particoular the "double plane" (a card in the code) wheels regular around the y axis.
The idea is to change the image texturized in the hidden plane each 200 iteration.
To found this face,
my idea is to calculate the angles between the camera position (treated as vector)
and normal vector to the surface of each 2 faces, obtaining two angle:
1) angle between camera-face1;
2) angle between camera and face2
The angle with the greater degree is the "face hidden" of the plane.
Then change the texture over this plane.
All works well (see log in the console),
but there is a bug: in the render function doesn't update the normal to the surface.
I try using the method computeFaceNormals() and normalsNeedUpdate attribute,
ma the values doesn't change. :()
