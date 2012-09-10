#pragma strict

var sound : AudioClip;
var audioSource : AudioSource;
var hero : GameObject;

private var played : boolean = false;
private var oldConstraints : RigidbodyConstraints;

function OnTriggerEnter (other : Collider) 
{
	if(played) return;
	if(other.gameObject != hero) return;
	

	audioSource.clip = sound;
	audioSource.Play();

	Time.timeScale = 0;

	played = true;
}


function Update () 
{
	if(!played) return;
	if(audioSource.isPlaying) return;

	Time.timeScale = 1;

	Destroy(this.gameObject);
}
