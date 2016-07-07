import { Injectable } from '@angular/core';
import firebase from 'firebase';

import { Store } from '../store';


@Injectable()
export class NoteService {

  constructor(
    private store: Store
  ) {  }

  
}