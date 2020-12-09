from unittest import TestCase
from app import app, update_score
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    # TODO -- write tests for every view function / feature!
    def test_boggle_load(self):

        with app.test_client() as client:
            res = client.get('/')
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code, 200)
            self.assertIn('<div id="boggle" class="box mt-6">', html)

    def test_score_init(self):

        with app.test_client() as client:
            res = client.get('/')

            self.assertEqual(res.status_code, 200)
            self.assertEqual(session['score'], 0)

    def test_session_plays_init(self):

        with app.test_client() as client:
            res = client.get('/')

            self.assertEqual(res.status_code, 200)
            self.assertEqual(session['plays'], 0)

    def test_check_word(self):

        boggle_game = Boggle()

        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session['board'] = boggle_game.make_board()
                change_session['score'] = 7
            res = client.get('/check-word?word=mario')

            self.assertEqual(res.status_code, 200)


    def test_update_plays(self):

        with app.test_client() as client:
            res = client.get('/update-plays')

            self.assertEqual(res.status_code, 200)
            self.assertEqual(session['plays'], 1)

    def test_session_topscore_init(self):

        with app.test_client() as client:
            res = client.get('/')

            self.assertEqual(res.status_code, 200)
            self.assertEqual(session['top_score'], 0)

    def test_update_top_score(self):

        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session['score'] = 10
                change_session['top_score'] = 5

            res = client.get('/update-top-score')

            self.assertEqual(res.status_code, 200)
            self.assertEqual(session['top_score'], 10)
    
    def test_update_score(self):
        with app.test_client() as client:
            res = client.get('/')
            update_score("ok")
            self.assertEqual(session['score'], 1)




