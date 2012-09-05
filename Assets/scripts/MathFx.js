// from http://wiki.unity3d.com/index.php?title=Mathfx

static function Hermite(start : float, end : float, value : float) : float
{
    return Mathf.Lerp(start, end, value * value * (3.0 - 2.0 * value));
}
 
static function Sinerp(start : float, end : float, value : float) : float
{
    return Mathf.Lerp(start, end, Mathf.Sin(value * Mathf.PI * 0.5));
}
 
static function Coserp(start : float, end : float, value : float) : float
{
    return Mathf.Lerp(start, end, 1.0 - Mathf.Cos(value * Mathf.PI * 0.5));
}
 
static function Berp(start : float, end : float, value : float) : float
{
    value = Mathf.Clamp01(value);
    value = (Mathf.Sin(value * Mathf.PI * (0.2 + 2.5 * value * value * value)) * Mathf.Pow(1 - value, 2.2) + value) * (1 + (1.2 * (1 - value)));
    return start + (end - start) * value;
}
 
static function SmoothStep (x : float, min : float, max : float) : float
{
    x = Mathf.Clamp (x, min, max);
    var v1 = (x-min)/(max-min);
    var v2 = (x-min)/(max-min);
    return -2*v1 * v1 *v1 + 3*v2 * v2;
}
 
static function Lerp(start : float, end : float, value : float) : float
{
    return ((1.0 - value) * start) + (value * end);
}
 
static function NearestPoint(lineStart : Vector3, lineEnd : Vector3, point : Vector3) : Vector3
{
    var lineDirection = Vector3.Normalize(lineEnd-lineStart);
    var closestPoint = Vector3.Dot((point-lineStart),lineDirection)/Vector3.Dot(lineDirection,lineDirection);
    return lineStart+(closestPoint*lineDirection);
}
 
static function NearestPointStrict(lineStart : Vector3, lineEnd : Vector3, point : Vector3) : Vector3
{
    var fullDirection = lineEnd-lineStart;
    var lineDirection = Vector3.Normalize(fullDirection);
    var closestPoint = Vector3.Dot((point-lineStart),lineDirection)/Vector3.Dot(lineDirection,lineDirection);
    return lineStart+(Mathf.Clamp(closestPoint,0.0,Vector3.Magnitude(fullDirection))*lineDirection);
}
static function Bounce(x : float) : float {
    return Mathf.Abs(Mathf.Sin(6.28*(x+1)*(x+1)) * (1-x));
}
 
// test for value that is near specified float (due to floating point inprecision)
// all thanks to Opless for this!
static function Approx(val : float, about : float, range : float) : boolean {
    return ( ( Mathf.Abs(val - about) < range) );
}
 
// test if a Vector3 is close to another Vector3 (due to floating point inprecision)
// compares the square of the distance to the square of the range as this 
// avoids calculating a square root which is much slower than squaring the range
static function Approx(val : Vector3, about : Vector3, range : float) : boolean {
   return ( (val - about).sqrMagnitude < range*range);
}
 
// CLerp - Circular Lerp - is like lerp but handles the wraparound from 0 to 360.
// This is useful when interpolating eulerAngles and the object
// crosses the 0/360 boundary.  The standard Lerp function causes the object
// to rotate in the wrong direction and looks stupid. Clerp fixes that.
static function Clerp(start : float, end : float, value : float) : float {
   var min = 0.0;
   var max = 360.0;
   var half = Mathf.Abs((max - min)/2.0);//half the distance between min and max
   var retval = 0.0;
   var diff = 0.0;
 
   if((end - start) < -half){
       diff = ((max - start)+end)*value;
       retval =  start+diff;
   }
   else if((end - start) > half){
       diff = -((max - end)+start)*value;
       retval =  start+diff;
   }
   else retval =  start+(end-start)*value;
 
   // Debug.Log("Start: "  + start + "   End: " + end + "  Value: " + value + "  Half: " + half + "  Diff: " + diff + "  Retval: " + retval);
   return retval;
}