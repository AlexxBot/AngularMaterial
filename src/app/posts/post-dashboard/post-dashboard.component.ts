import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { PostService } from '../post.service';
import { Observable, from } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-post-dashboard',
  templateUrl: './post-dashboard.component.html',
  styleUrls: ['./post-dashboard.component.css']
})
export class PostDashboardComponent implements OnInit {

  title: string;
  image: string;
  content: string;

  buttonText: string = "Create Post";

  uploadPercent : Observable<number>;
  //downloadURL : Observable<string>;


  constructor(private auth: AuthService, private postService: PostService, private storage: AngularFireStorage) { }

  ngOnInit(): void {
  }

  createPost(){
    const data = {
      author: this.auth.authState.displayName || this.auth.authState.email,
      authorId: this.auth.currentUserId,
      content: this.content,
      image: this.image || null,
      published: new Date(),
      title: this.title

    }
    this.postService.create(data);
    this.title = '';
    this.content = '';
    this.image = '';
    this.buttonText = "Post Created";
    setTimeout(() => (this.buttonText = "Create Post"), 4000);
    

  }

   private getDownloadUrl(
    uploadTask: AngularFireUploadTask,
    path: string,
  ): Observable<string> {
    return from(uploadTask).pipe(switchMap((_) => this.storage.ref(path).getDownloadURL()),
    );
  }

  uploadImage(event){

    const file = event.target.files[0];
    const path = "post/" + Date.now() + file.name;
    const uploadTask: AngularFireUploadTask = this.storage.upload(path, file);
    return {
      uploadPercent: uploadTask.percentageChanges(),
      download: this.getDownloadUrl(uploadTask, path).subscribe((url) => {this.image = url; console.log("imagen" + this.image)}),
      
    };
    
    
    /* if(file.type.split('/')[0] !== "image"){
      return alert("only image files");
    }
    else{
      const task = this.storage.upload(path, file);
      this.downloadURL = task
      this.uploadPercent = task.percentageChanges();
    } */

  }

}
