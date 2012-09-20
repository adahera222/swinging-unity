#pragma strict

var flyingScalar : float = 2;
var flyingDrag : float = 0.1;
var flyingTime : float = 1;
var timeBetweenBoosts : float = 2;

private var pickedFlyToTime : int = 0;


function Start () 
{
	rigidbody.freezeRotation = true;
	
	var jumpingDirection : Vector3 = rigidbody.velocity.normalized;
	var angle : float = Mathf.Atan2(jumpingDirection.y, jumpingDirection.x);
	rigidbody.rotation = Quaternion.Euler(0, 0, Mathf.Rad2Deg * angle);
	
	//print("angle is " + Mathf.Rad2Deg * angle + ", vector is "+ jumpingDirection.x + ", " + jumpingDirection.y);	
}


function FixedUpdate () 
{
	if(pickedFlyToTime > 0)
	{
		if(Time.time - pickedFlyToTime > flyingTime)
		{
			rigidbody.useGravity = true;
		}
		
		if(Time.time - pickedFlyToTime > timeBetweenBoosts)
		{
			pickedFlyToTime = 0;
		}
	}
	else if(Input.GetMouseButtonDown(0))
	{
		var screenPoint : Vector3 = Input.mousePosition;
		screenPoint.z = Mathf.Abs(Camera.main.transform.position.z);
		var worldPoint : Vector3 = Camera.main.ScreenToWorldPoint(screenPoint);
		
		Instantiate(Resources.Load("flyToParticles"), worldPoint, Quaternion.identity);
		
		var direction : Vector3 = (worldPoint - rigidbody.position).normalized;
		rigidbody.rotation = Quaternion.Euler(0, 0, Mathf.Atan2(direction.y, direction.x) * Mathf.Rad2Deg);
		
		rigidbody.useGravity = false;
		rigidbody.drag = flyingDrag;
		rigidbody.velocity = direction * flyingScalar;
		
		pickedFlyToTime = Time.time;
	}
}



function OnDestroy() 
{
	rigidbody.useGravity = true;
	rigidbody.freezeRotation = false;
}
