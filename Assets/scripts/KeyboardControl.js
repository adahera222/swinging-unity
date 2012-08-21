#pragma strict


var swingForceScalar : float = 10;
var swingDistance : float = 0.1;
var flapImpulseScalar : float = 2;
var diveForceScalar : float = 2;
var sideFlyingScalar : float = 2;
var jumpBoostScalar : float = 1;
var grabbingDrag : float = 1;
var climbingMovement : float = 0.1;
var ropeSegmentLength : float = 4;


private var touchingTriggers : Array = []; // of Collider
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
		var touchingTrigger : Collider = touchingTriggers.length > 0 ? touchingTriggers[0] : null;
		
		// attempt to create new attachment to _touchingTrigger_
		if(joint || !touchingTrigger) return;
		
		CreateJoint(touchingTrigger);
	}
	else if(joint)
	{
		// destroy joint and add jump boost 
		Destroy(joint);
		joint = null;
		
		rigidbody.AddForce(rigidbody.velocity.normalized * jumpBoostScalar, ForceMode.VelocityChange);
	}
}


function OnTriggerEnter (other : Collider) 
{
	Utility.AddToSet(touchingTriggers, other);
}


function OnTriggerExit (other : Collider) 
{
	Utility.RemoveFromSet(touchingTriggers, other);
}


function CreateJoint(touchingTrigger : Collider) : void
{
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
		var targetLocalPos : Vector3 = touchingTrigger.transform.InverseTransformPoint(transform.position);
		targetLocalPos.x = 0;
		targetLocalPos.z = 0;
		
		// we want the joint to be centered on the chain, so move us there to start
		transform.position = touchingTrigger.transform.position; // touchingTrigger.transform.TransformPoint(targetLocalPos);
		transform.rotation = touchingTrigger.transform.rotation;
					
		var configurableJoint : ConfigurableJoint = gameObject.AddComponent("ConfigurableJoint") as ConfigurableJoint;
		configurableJoint.connectedBody = touchingTrigger.rigidbody;
		configurableJoint.anchor = Vector3.zero;
		// why is this negative? are the joint axes wrong?
		configurableJoint.targetPosition = -targetLocalPos;
		configurableJoint.xMotion = ConfigurableJointMotion.Locked;
		configurableJoint.yMotion = ConfigurableJointMotion.Limited;
		configurableJoint.linearLimit.limit = 2; // TODO: replace with joint length
		configurableJoint.angularXMotion = ConfigurableJointMotion.Locked;
		configurableJoint.angularYMotion = ConfigurableJointMotion.Locked;
		configurableJoint.angularZMotion = ConfigurableJointMotion.Locked;
		configurableJoint.yDrive.mode = JointDriveMode.PositionAndVelocity;
		configurableJoint.yDrive.positionSpring = 20; // TODO: best value?
		configurableJoint.yDrive.positionDamper = 20; // TODO: best value?

		// now move us directly into position, to avoid the lag of having the joint do it
		transform.position = touchingTrigger.transform.TransformPoint(targetLocalPos);
		
		joint = configurableJoint;
	}
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
		if(configurableJoint.targetPosition.y < -configurableJoint.linearLimit.limit / 2) 
		{
			var otherChain : Collider = Utility.FindWhere(touchingTriggers, function(i_collider : Collider)
			{
				return i_collider.tag == "rope" && i_collider != configurableJoint.connectedBody.collider;
			});
			
			if(otherChain) 
			{
				Destroy(joint);
				CreateJoint(otherChain);
			}
			else
			{				
				// keep us in bounds
				configurableJoint.targetPosition.y = -configurableJoint.linearLimit.limit / 2;
			}
		}
	}
	if(Input.GetKey("down"))
	{
		configurableJoint.targetPosition.y += climbingMovement;
		if(configurableJoint.targetPosition.y > configurableJoint.linearLimit.limit / 2) 
		{
			otherChain = Utility.FindWhere(touchingTriggers, function(i_collider : Collider)
			{
				return i_collider.tag == "rope" && i_collider != configurableJoint.connectedBody.collider;
			});
			
			if(otherChain) 
			{
				Destroy(joint);
				CreateJoint(otherChain);
			}
			else
			{				
				// keep us in bounds
				configurableJoint.targetPosition.y = configurableJoint.linearLimit.limit / 2;
			}
		}
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