import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/models/message.model';
import { DefaultService } from 'src/app/services/default/default.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css', '../../../../../styles.css']
})
export class IndexComponent implements OnInit {
  numberOfStudents: string = "";

  constructor(private defaultService: DefaultService) { }

  ngOnInit(): void {
    this.defaultService.getNumberOfStudents().subscribe(
      (message: Message) => {
        this.numberOfStudents = message.content
      }
    )
  }
}
