#pragma strict

var sound : AudioClip;
var audioSource : AudioSource;


private var played : boolean = false;
private var oldConstraints : RigidbodyConstraints;


function OnTriggerEnter (other : Collider) 
{
	if(played) return;
	if(other.tag != "Player") return;
	

	audioSource.clip = sound;
	audioSource.Play();

	Time.timeScale = 0;
	GameObject.Find("CameraBlock").renderer.enabled = true;

	played = true;
}


function Update () 
{
	if(!played) return;
	if(audioSource.isPlaying) return;

	Time.timeScale = 1;
	GameObject.Find("CameraBlock").renderer.enabled = false;

	Destroy(this.gameObject);
}
