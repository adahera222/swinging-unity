#pragma strict


var pole : Collider;
var swingDistance : float = 1;
var swingMaxForce : float = 10;
var swingVelocity : float = 50;
var jumpBoostScalar : float = 5;
var consideredMousePoints : int = 10;
var minimumSum : float = 200;
var maximumLength : float = 500;

private var joint : HingeJoint;
private var lastMousePoints : Array = []; // of Vector2

function Start () 
{
	var currentPosition = transform.position;
	var otherPosition = pole.GetComponent(Transform).position;

	// put ourselves at swingDistance from the pole, in the current direction	
	var targetPosition : Vector3 = otherPosition + (currentPosition - otherPosition).normalized * swingDistance;
	transform.position = targetPosition;
	
	// point at the pole
	var directionToTarget : Vector3 = otherPosition - targetPosition;
	transform.rotation = Quaternion.Euler(0, 0, Mathf.Atan2(directionToTarget.y, directionToTarget.x) * Mathf.Rad2Deg);
	
	// hinge should coincide with the center of _other_ 
	var hingeLocalPosition = transform.InverseTransformPoint(otherPosition);
	
	joint = gameObject.AddComponent("HingeJoint");
	joint.axis = Vector3.back;
	joint.anchor = hingeLocalPosition;
}


function FixedUpdate () 
{
	var currentMousePoint : Vector3 = Input.mousePosition;

	lastMousePoints.Push(Input.mousePosition);
	if(lastMousePoints.length < consideredMousePoints) return;
	if(lastMousePoints.length > consideredMousePoints) lastMousePoints.shift();
	
	// Sum over the edges, (x2-x1)(y2+y1). If the result is positive the curve is clockwise, if it's negative the curve is counter-clockwise.
	// from http://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order
	
	var crossProductSum : float = 0;
	var lengthSum : float = 0; 
	for(var i : int = 0; i < lastMousePoints.length; i++)
	{
		// TODO: use proper casting to avoid these temp variables. But what's the syntax?
		var pointA : Vector3 = lastMousePoints[i];
		var pointB : Vector3 = lastMousePoints[(i+1) % lastMousePoints.length];

		crossProductSum += (pointB.x - pointA.x) * (pointB.y + pointA.y);
		lengthSum += Vector3.Distance(pointA, pointB);
	}
	
	//Debug.Log("cross " + crossProductSum + ", length " + lengthSum);

	if(Mathf.Abs(crossProductSum) < minimumSum)
	{
		//Debug.Log("inconsistent");
		joint.useMotor = false;
		return;
	}
	else if(crossProductSum > 0) 
	{
		joint.motor.targetVelocity = swingVelocity * Mathf.Min(lengthSum, maximumLength) / maximumLength;
		//Debug.Log("cw - velocity " + joint.motor.targetVelocity);
	}
	else
	{
		joint.motor.targetVelocity = -swingVelocity * Mathf.Min(lengthSum, maximumLength) / maximumLength;
		//Debug.Log("ccw - velocity " + joint.motor.targetVelocity);
	}		
		
	joint.useMotor = true;
	joint.motor.force = swingMaxForce;
}


function OnDestroy()
{
	// destroy joint and add jump boost 
	Destroy(joint);
	
	if(rigidbody.velocity.magnitude > 1)
		rigidbody.AddForce(rigidbody.velocity.normalized * jumpBoostScalar, ForceMode.VelocityChange);
}
