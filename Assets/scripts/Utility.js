#pragma strict

static function ArrayContains(arr : Array, key) : boolean
{
	for(val in arr) if(val == key) return true;
	return false;
}


static function RemoveFromSet(arr : Array, key) : void
{
	for(var i : int = 0; i < arr.length; i++) 
		if(arr[i] == key) arr.RemoveAt(i);
}


static function AddToSet(arr : Array, key) : boolean
{
	if(ArrayContains(arr, key)) return false;
	
	arr.Push(key);
	return true;
}


static function FindWhere(arr : Array, condition : Function) 
{
	for(val in arr) if(condition(val)) return val;
	return null;
}


static function Hermite(start : Vector3, end : Vector3, value : float) : Vector3
{
    return Vector3(MathFx.Hermite(start.x, end.x, value), MathFx.Hermite(start.y, end.y, value), MathFx.Hermite(start.z, end.z, value));
}

 
static function AimInDirection(start : Vector3, end : Vector3) : Quaternion
{
	var diff : Vector3 = end - start;
	var angle : float = Mathf.Atan2(diff.y, diff.x);
	return Quaternion.Euler(0, 0, Mathf.Rad2Deg * angle);
}
