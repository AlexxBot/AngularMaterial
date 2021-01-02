import { Injectable } from '@angular/core';
import { AngularFirestore,
        AngularFirestoreCollection,
        AngularFirestoreDocument }
        from 'angularfire2/firestore';
        import { Post } from './post';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

//import { map } from "rxjs/operators"; 
//import 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class PostService {

postsCollection: AngularFirestoreCollection<Post>
postDoc: AngularFirestoreDocument<Post>

  constructor(private firestore: AngularFirestore ) { 
    this.postsCollection = this.firestore.collection('posts', ref =>
        ref.orderBy('published', 'desc')
    );  
  }

  getPosts() : Observable<any>{
    //return this.postsCollection.valueChanges();
    return this.postsCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Post;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });

  }

  getPostData(id: string) {
    this.postDoc = this.firestore.doc<Post>('posts/' +id);
    return this.postDoc.valueChanges();
    /*return this.postDoc.snapshotChanges().map(value => {
        const data = value.payload.data() as Post;
        console.log("value" + value.payload);
        const id = value.payload.id;
        return { id, ...data };
    }); */
  }

  create(data: Post){
    this.postsCollection.add(data)
  }

  getPost(id: string)
  {
    return this.firestore.doc<Post>('posts/' +id)
  }

  delete(id: string){
    return this.getPost(id).delete()
  }

  update(id: string, formData){
    return this.getPost(id).update(formData)
  }
}
