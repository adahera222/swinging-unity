#pragma strict


var swingForceScalar : float = 10;
var swingDistance : float = 0.1;
var flapImpulseScalar : float = 2;
var diveForceScalar : float = 2;
var sideFlyingScalar : float = 2;
var timeBetweenFlaps : float = 1;
var jumpBoostScalar : float = 1;
var grabbingDrag : float = 1;
var climbingMovement : float = 0.1;


private var touchingTrigger : Collider;
private var joint : Joint;


function Start () 
{
	// nop
}


function FixedUpdate () 
{
	if(joint instanceof HingeJoint) HandlePoleControl();
	else if(joint instanceof ConfigurableJoint) HandleChainControl();
	else HandleFlyingControl();
			
	if(Input.GetKey("space"))
	{
		// attempt to create new attachment to _touchingTrigger_
		if(joint || !touchingTrigger) return;
		
		if(touchingTrigger.tag == "pole")
		{
			var currentPosition = transform.position;
			var otherPosition = touchingTrigger.GetComponent(Transform).position;
			
			// _this_ should be at _swingDistance_ of _touchingTrigger_
			// we assume that swingDistance < currentDistance
			if(swingDistance > Vector3.Distance(currentPosition, otherPosition)) Debug.LogError("swingDistance > currentDistance"); 
			
			var targetPosition = currentPosition + (swingDistance / Vector3.Distance(currentPosition, otherPosition)) * (currentPosition - otherPosition);
			transform.position = targetPosition;
			
			// hinge should coincide with the center of _other_ 
			var hingeLocalPosition = transform.InverseTransformPoint(otherPosition);
			
			joint = gameObject.AddComponent("HingeJoint");
			joint.axis = Vector3.back;
			joint.anchor = hingeLocalPosition;
		}
		else if(touchingTrigger.tag == "rope")
		{
			// adjust our position to lie on the Y-axis of the rope
			var newLocalPosition : Vector3 = touchingTrigger.transform.InverseTransformPoint(transform.position);
			newLocalPosition.x = 0;
			newLocalPosition.z = 0;
			
			transform.position = touchingTrigger.transform.TransformPoint(newLocalPosition);
			transform.rotation = touchingTrigger.transform.rotation;
						
			var configurableJoint : ConfigurableJoint = gameObject.AddComponent("ConfigurableJoint") as ConfigurableJoint;
			configurableJoint.connectedBody = touchingTrigger.rigidbody;
			configurableJoint.anchor = newLocalPosition;
			configurableJoint.xMotion = ConfigurableJointMotion.Locked;
			configurableJoint.yMotion = ConfigurableJointMotion.Limited;
			configurableJoint.linearLimit.limit = 4; // TODO: replace with joint length
			configurableJoint.angularXMotion = ConfigurableJointMotion.Locked;
			configurableJoint.angularYMotion = ConfigurableJointMotion.Locked;
			configurableJoint.angularZMotion = ConfigurableJointMotion.Locked;
			configurableJoint.yDrive.mode = JointDriveMode.PositionAndVelocity;
			configurableJoint.yDrive.positionSpring = 20; // TODO: best value?
			configurableJoint.yDrive.positionDamper = 20; // TODO: best value?
			
			joint = configurableJoint;
		}
	}
	else if(joint)
	{
		// destroy joint and add jump boost 
		Destroy(joint);
		
		rigidbody.AddForce(rigidbody.velocity.normalized * jumpBoostScalar, ForceMode.VelocityChange);
	}
}


function OnTriggerEnter (other : Collider) 
{
	touchingTrigger = other;
}


function OnTriggerExit (other : Collider) 
{
	touchingTrigger = null;
}


function HandlePoleControl()
{
	// drag may be leftover from flying control
	rigidbody.drag = 0;

	if(Input.GetKey("left"))
		rigidbody.AddForce(Vector3.left * swingForceScalar, ForceMode.Acceleration);
	if(Input.GetKey("right"))
		rigidbody.AddForce(Vector3.right * swingForceScalar, ForceMode.Acceleration);
	if(Input.GetKey("up"))
		rigidbody.AddForce(Vector3.up * swingForceScalar, ForceMode.Acceleration);
	if(Input.GetKey("down"))
		rigidbody.AddForce(Vector3.down * swingForceScalar, ForceMode.Acceleration);
}


function HandleChainControl()
{
	// drag may be leftover from flying control
	rigidbody.drag = 0;

	if(Input.GetKey("left"))
		rigidbody.AddForce(Vector3.left * swingForceScalar, ForceMode.Acceleration);
	if(Input.GetKey("right"))
		rigidbody.AddForce(Vector3.right * swingForceScalar, ForceMode.Acceleration);
	
	// TODO: detect when move needed to next segment of chain
	var configurableJoint : ConfigurableJoint = joint as ConfigurableJoint;
	if(Input.GetKey("up"))
	{
		configurableJoint.targetPosition.y -= climbingMovement;
	}
	if(Input.GetKey("down"))
	{
		configurableJoint.targetPosition.y += climbingMovement;
	}
}


function HandleFlyingControl()
{
	if(Input.GetKey("up"))
	{
		rigidbody.AddForce(new Vector3(0, 1, 0) * flapImpulseScalar, ForceMode.Acceleration);
	}
	else if(Input.GetKey("down"))
	{
		rigidbody.AddForce(new Vector3(0, -1, 0) * diveForceScalar, ForceMode.Acceleration);
	}
	
	if(Input.GetKey("left")) rigidbody.AddForce(new Vector3(-sideFlyingScalar, 0, 0), ForceMode.Acceleration);
	else if(Input.GetKey("right")) rigidbody.AddForce(new Vector3(sideFlyingScalar, 0, 0), ForceMode.Acceleration);

	if(Input.GetKey("space")) rigidbody.drag = grabbingDrag;
	else rigidbody.drag = 0;
}