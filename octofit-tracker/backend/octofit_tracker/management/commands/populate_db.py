from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Workout, Leaderboard
from django.utils import timezone
from pymongo import MongoClient
from django.db import IntegrityError

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Clear existing data using pymongo to avoid Djongo delete collector issues
        client = MongoClient(host='localhost', port=27017)
        db = client['octofit_db']
        for col in ['leaderboard', 'activities', 'workouts', 'users', 'teams']:
            try:
                db[col].drop()
            except Exception:
                pass

        # Populate collections using pymongo to avoid Djongo ORM issues
        teams = [
            {'name': 'Marvel', 'description': 'Marvel superheroes'},
            {'name': 'DC', 'description': 'DC superheroes'},
        ]
        team_result = db['teams'].insert_many(teams)
        team_ids = dict(zip([t['name'] for t in teams], team_result.inserted_ids))

        users = [
            {'name': 'Tony Stark', 'email': 'tony@stark.com', 'team_id': team_ids['Marvel']},
            {'name': 'Steve Rogers', 'email': 'steve@rogers.com', 'team_id': team_ids['Marvel']},
            {'name': 'Bruce Banner', 'email': 'bruce@banner.com', 'team_id': team_ids['Marvel']},
            {'name': 'Clark Kent', 'email': 'clark@kent.com', 'team_id': team_ids['DC']},
            {'name': 'Diana Prince', 'email': 'diana@prince.com', 'team_id': team_ids['DC']},
        ]
        user_result = db['users'].insert_many(users)
        user_ids = dict(zip([u['email'] for u in users], user_result.inserted_ids))

        workouts = [
            {'name': 'Pushups', 'description': 'Upper body', 'difficulty': 'Easy'},
            {'name': 'Running', 'description': 'Cardio', 'difficulty': 'Medium'},
            {'name': 'Yoga', 'description': 'Flexibility', 'difficulty': 'Easy'},
        ]
        db['workouts'].insert_many(workouts)

        today = timezone.now()
        activities = [
            {'user_id': user_ids['tony@stark.com'], 'type': 'Running', 'duration': 30, 'date': today},
            {'user_id': user_ids['steve@rogers.com'], 'type': 'Pushups', 'duration': 20, 'date': today},
            {'user_id': user_ids['bruce@banner.com'], 'type': 'Yoga', 'duration': 40, 'date': today},
            {'user_id': user_ids['clark@kent.com'], 'type': 'Running', 'duration': 25, 'date': today},
            {'user_id': user_ids['diana@prince.com'], 'type': 'Yoga', 'duration': 35, 'date': today},
        ]
        db['activities'].insert_many(activities)

        leaderboard = [
            {'user_id': user_ids['tony@stark.com'], 'score': 120},
            {'user_id': user_ids['steve@rogers.com'], 'score': 110},
            {'user_id': user_ids['bruce@banner.com'], 'score': 100},
            {'user_id': user_ids['clark@kent.com'], 'score': 130},
            {'user_id': user_ids['diana@prince.com'], 'score': 125},
        ]
        db['leaderboard'].insert_many(leaderboard)

        self.stdout.write(self.style.SUCCESS('Test data populated successfully!'))
