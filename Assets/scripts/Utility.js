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