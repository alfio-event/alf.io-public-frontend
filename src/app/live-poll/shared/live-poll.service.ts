import { Injectable } from '@angular/core';
import { LivePollModule } from '../live-poll.module';
import { Observable } from 'rxjs';
import { Poll } from '../model/poll';
import { PollWithOptions } from '../model/poll-with-options'
import { PollVoteForm } from '../model/poll-vote-form'
import { ValidatedResponse } from '../../model/validated-response';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: LivePollModule
})
export class LivePollService {

  constructor(private http: HttpClient) { }


  getAllPolls(eventName: string, pin: string): Observable<ValidatedResponse<Poll[]>> {
    return this.http.get<ValidatedResponse<Poll[]>>(`/api/v2/public/event/${eventName}/poll`, {params: {pin: pin}});
  }

  getPoll(eventName: string, pollId: number, pin: string): Observable<ValidatedResponse<PollWithOptions>> {
    return this.http.get<ValidatedResponse<PollWithOptions>>(`/api/v2/public/event/${eventName}/poll/${pollId}`, {params: {pin: pin}});
  }

  registerAnswer(eventName: string, pollId: number, pollForm: PollVoteForm): Observable<ValidatedResponse<boolean>> {
    return this.http.get<ValidatedResponse<boolean>>(`/api/v2/public/event/${eventName}/poll/${pollId}`, pollForm);
  }
}
