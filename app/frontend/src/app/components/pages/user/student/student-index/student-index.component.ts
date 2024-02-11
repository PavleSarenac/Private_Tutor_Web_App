import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { DefaultService } from 'src/app/services/default/default.service';

@Component({
  selector: 'app-student-index',
  templateUrl: './student-index.component.html',
  styleUrls: ['./student-index.component.css', '../../../../../../styles.css']
})
export class StudentIndexComponent implements OnInit {
  user: User = new User()

  constructor(private defaultService: DefaultService) { }

  ngOnInit(): void {
    this.defaultService.getUser(JSON.parse(localStorage.getItem("loggedInUser")!).username).subscribe(
      (user) => {
        this.user = user
      }
    )
  }
}
